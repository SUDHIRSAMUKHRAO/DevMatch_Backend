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
- GET /user/connection
- GET /user/request
- GET /user/feed - get you to the profile of the user on platform


status - ignore,intrested,accepted,rejected



