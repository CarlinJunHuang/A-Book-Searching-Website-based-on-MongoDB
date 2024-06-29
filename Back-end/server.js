const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
app.use(cors());

// TODO: 填上你的PORT
const port = ***;

app.use(express.json());

// TODO: 填上你的MongoDB连接URL和数据库名
const url = 'mongodb+srv://{UserName}:{url}.naapprs.mongodb.net/?retryWrites=true&w=majority';
const dbName = 'kindleBooks';

// 创建MongoDB客户端
const client = new MongoClient(url);

async function main() {
  try {
    // 连接到数据库
    await client.connect();
    console.log("Connected successfully to database");

    // 获取数据库
    const db = client.db(dbName);

    app.get('/', (req, res) => {
      res.send('Welcome to the Book Search API!');
    });

    app.get('/search', async (req, res) => {
      try {
        const booksCollection = db.collection('books');
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 30;
        const skip = (page - 1) * limit;
        const searchQuery = req.query.query;
        const regexQuery = new RegExp(escapeRegex(searchQuery).split(" ").join("|"), 'i');

        const pipeline = [
          {
            $match: {
              $or: [{ title: regexQuery }, { author: regexQuery }]
            }
          },
          {
            $addFields: {
              relevanceScore: {
                $cond: {
                  if: { $gte: ["$title_length", 1] },
                  then: {
                    $divide: [
                      { $multiply: [{ $size: { $regexFindAll: { input: "$title", regex: regexQuery } } }, searchQuery.length] },
                      "$title_length"
                    ]
                  },
                  else: 0
                }
              }
            }
          },
          {
            $addFields: {
              combinedScore: { $add: ["$weightedScore",{ $multiply: ["$relevanceScore", 2] }] }
            }
          },
          {
            $sort: { combinedScore: -1 } // 根据相关性和权重排序
            //$sort: { relevanceScore: -1 }
          },
          {
            $skip: skip
          },
          {
            $limit: limit
          }
        ];
        console.error('page:', page);
        console.error('skip:', skip);

        const results = await booksCollection.aggregate(pipeline).toArray();
        res.status(200).json(results);
      } catch (err) {
        console.error('搜索错误:', err.message);
        res.status(500).json({ message: err.message });
      }
    });

    function escapeRegex(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // app.get('/search', async (req, res) => {
    //   try {
    //     const booksCollection = db.collection('books');
    //     const searchQuery = req.query.query;
    //     const regexQuery = new RegExp(searchQuery.split(" ").join("|"), 'i');

    //     let results = await booksCollection.find({
    //       $or: [{ title: regexQuery }, { author: regexQuery }]
    //     }).toArray();

    //     // 加权排序逻辑
    //     results = results.map(book => {
    //       let weight = book.stars;
    //       if (book.isBestSeller === "True") weight += 3;
    //       if (book.isEditorsPick === "True") weight += 1.5;
    //       if (book.isGoodReadsChoice === "True") weight += 1.5;
    //       return { ...book, weight };
    //     }).sort((a, b) => b.weight - a.weight).slice(0, 500);

    //     res.status(200).json(results);
    //   } catch (err) {
    //     console.error('搜索错误:', err.message);
    //     res.status(200).json({ message: err.message });
    //   }
    // });


    // app.get('/search', async (req, res) => {
    //   try {
    //     const booksCollection = db.collection('books');
    //     const query = { title: new RegExp(req.query.title, 'i') };
    //     console.log('查询参数:', req.query.title); // 日志输出查询参数
    //     const results = await booksCollection.find(query).toArray();
    //     console.log('查询结果:', results); // 日志输出查询结果
    //     res.status(200).json(results);
    //   } catch (err) {
    //     console.error('搜索错误:', err.message);
    //     res.status(500).json({ message: err.message });
    //   }
    // });

    app.get('/search', async (req, res) => {
      try {
        const booksCollection = db.collection('books');
        const searchQuery = req.query.query;
        const query = {
          $or: [
            { title: new RegExp(searchQuery, 'i') },
            { author: new RegExp(searchQuery, 'i') }
          ]
        };
        const results = await booksCollection.find(query)
          .sort({ stars: -1 }) // 按评分降序排序
          .limit(500) // 限制结果数为500
          .toArray();
        res.status(200).json(results);
      } catch (err) {
        console.error('搜索错误:', err.message);
        res.status(500).json({ message: err.message });
      }
    });

    function calculateRelevance(book, query) {
      let frequency = (book.title.match(new RegExp(query, "gi")) || []).length;
      let relevanceScore = frequency / book.title_length; // 使用 title_length 调整频率
      return relevanceScore;
    }

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}


main();
