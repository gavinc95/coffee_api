Coffee Shop API based on [blog post](http://mherman.org/blog/2016/11/05/developing-a-restful-api-with-node-and-typescript/#.WB3zyeErJE4).

## Want to use this project?

1. Fork/Clone
1. Install dependencies - `npm install`
1. Compile - `npm run build`
1. Compile assets - `gulp assets`
1. Run the development server - `npm start`

## API Documentation

1. Create a coffee shop
```
curl --data "name=Starbucks Coffee&address=New York, New York&latitude=123123&longitude=-999" http://localhost:3000/api/v1/coffee/create/
```

1. Update a coffee shop
```
curl -X PUT -d name=CatCafe -d address=California -d id=2 http://localhost:3000/api/v1/coffee/update/
```

1. Find a coffee shop
```
curl http://localhost:3000/api/v1/coffee/1
```

1. Delete a coffee shop
```
curl -X DELETE http://localhost:3000/api/v1/coffee/delete/1
```
