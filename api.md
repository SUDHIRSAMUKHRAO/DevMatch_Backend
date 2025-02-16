#devtinder api

authRouter
-  POST / signup
-  POST / login
-  POST / logout

ProfileRouter
- GET /profile/view
- GET /profile/edit
- GET /profile/password

connectionRequestRouter
- POST /request/send/intrested/:userid
- POST /request/send/ignored/:userid
- POST /request/review/accepted/:userid
- POST /request/send/rejected/:userid

userRouter
- GET /user/request
- GET /user/connection
- GET/feed - get you to the profile of the user on platform


status - ignore,intrested,accepted,rejected

Pagination logic for Feed api
skip - (page-1) * limit =   (2ndpage -1) *10 =  1*10 =  10 skip 10
skip - (page-1) * limit = (3ndpage -1) * 10 = 2*10 = 20 skip  for page 3
page =  1 limit = 10   =  1o users
page 2 = skip = 10 limit 10 = (11-20)
page 3 = skip = 10 limit    10 = ( 21-30 )  

