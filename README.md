- How to set up and execute
1. use nodejs 16.6.0(this version for couchbase more stable 
```
nvm install 16.6.0
```
2.  start db service
```
 docker-compose up -d
```

3. download all dependencies
```
npm install
```

4. run the project(include client and server)
```
npm run start
 ```

5. build the project 
```
docker build -t hero-hotel .
```

- About the project
1. use learn to manager FE and BE
2. use docker to manager development environment
2. client
 * components: the components used by multiple pages
 * pages: all the pages include guest and employee 
 * core:  http core utils and graphql basic client base on axios 
 * services: business service logic 
3. server
 * __tests__: one unit test case for reservation repository base on jest(Sorry,I try to use cucumber but I met some issues)
 * components: all dependencies for the jwt 
 * controllers: all restful api definition
 * graphql: all graphql resolver for employee, include schema and resolver
 * mode: all the data model in db
 * repositories: all the db operation functions for the entities in model
 * services: all the business service logic
4. shared
* define the common type and interface shared with client and server

- Test case
1.	Guests should able to make reservations.
```
curl --location 'http://127.0.0.1:3001/reservations' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjlhNmQzY2FkLTFkZDEtNGZlZS05YmMzLWM1MDNjOWZjNzFjMiIsInBob25lIjoiMTM4MDAxMzgwMDEiLCJyb2xlIjoiZ3Vlc3QiLCJpYXQiOjE3NDMyOTg1MjgsImV4cCI6MTc0MzMwMjEyOH0.GWwyIJ3YI0ArALfp-iZgkD7pxBHdOkmH_wihc8uFMJ8' \
--data '{
    "guestName": "heshuai1",
    "guestContact": "17858968657",
    "arrivalTime": "2023-11-15T14:30:45.000Z",
    "tableSize": 4,
    "status":"待确认",
    "userId":"111111222"
}'
```

2.	Guests should able to update their reservations.
```
curl --location --request PUT 'http://127.0.0.1:3001/reservations/992b5ef4-4a66-460b-a7c6-b9320e79e2c1' \
--header 'Content-Type: application/json' \
--header 'Authorization: ••••••' \
--data '{
    "tableSize": 6
}'
```
3.	Guests should able to cancel their reservations.
```
curl --location --request PUT 'http://127.0.0.1:3001/reservations/992b5ef4-4a66-460b-a7c6-b9320e79e2c1' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjlhNmQzY2FkLTFkZDEtNGZlZS05YmMzLWM1MDNjOWZjNzFjMiIsInBob25lIjoiMTM4MDAxMzgwMDEiLCJyb2xlIjoiZ3Vlc3QiLCJpYXQiOjE3NDMyOTg1MjgsImV4cCI6MTc0MzMwMjEyOH0.GWwyIJ3YI0ArALfp-iZgkD7pxBHdOkmH_wihc8uFMJ8' \
--data '{
    "status": "已取消"
}'
```
4.	Restaurant employees should able to update reservations.
```
query Query {
  updateReservation(id: "217a01a3-616f-4a74-91f2-150c765b09ed", guestContact: "newheshuai") {
    arrivalTime
    guestContact
    status
  }
}
```
5.	Restaurant employees should able to mark a reservation as completed or canceled.
```
query Query {
  updateReservation(id: "217a01a3-616f-4a74-91f2-150c765b09ed", status: "已完成") {
    arrivalTime
    guestContact
    status
  }
}
```
6.	Restaurant employees should able to browse all the reservations by date and status.
```
query Reservations {
  reservations(status: "待确认") {
    guestContact
    arrivalTime
    guestName
    id
    status
    tableSize
    userId
  }
  
}
```

7.	Restaurant employees should able to check reservation detail.
```
   query Query {
reservation(id:"217a01a3-616f-4a74-91f2-150c765b09ed") {
id
status
guestName
guestContact
arrivalTime
tableSize
}
}
   ```


- couchbase issue
1. need some extra dependencies
	* export COUCHBASE_NODE_PREBUILT=true & export BOOST_ROOT=/usr/local/Cellar/boost  & export CXXFLAGS="-std=c++17" & npm install couchbase --save
	* npm rebuild couchbase
	* npm install couchbase --build-from-source 二进制安装
2. run in docker in order to keep enivronment same 
   run in docker in order to keep enivronment same 
   * docker run -ti --rm  -v /Users/heand/workspace/learn/hero-hotel:/app -p 3001:3001 -p 3001:3001 --platform=linux/amd64 node:16.6 bash 
   (--platform=linux/amd64 is for mac m1 m2)
   * apt-get update
   * apt-get install -y python3 python3-pip
   * npm install
   * npm run start
3. couchbase 3 node 16 can resolve the issue


- can be improved points(next steps)
1. couchbase connection use lb4 recommended
2. employee login and auth
3. more test case use cucumber