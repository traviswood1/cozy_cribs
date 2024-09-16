// Use DBML to define your database structure
// Docs: https://dbml.dbdiagram.io/docs

Table spotImages  {
    id integer [primary key]
    url varchar
    preview boolean
  }
  
  Table users {
    id integer [primary key]
    firstName varchar
    lastName varchar
    email varchar
    userName varchar
    password varchar
  }
  
  Table spots {
    id integer [primary key]
    ownerId integer
    address varchar
    city varchar
    state varchar
    country varchar
    lat decimal
    lng decimal
    name varchar
    description varchar
    price decimal
    createdAt timestamp
    updatedAt timestamp
    avgRating decimal
    spotImages varchar
  }
  
  Table reviews {
    id integer [primary key]
    userId integer
    spotId integer
    review varchar
    stars decimal
    createdAt timestamp
    updatedAt timestamp
    reviewImages varchar
  }
  
  Table bookings {
    id integer [primary key]
    userId integer
    spotId integer
    startDate timestamp
    endDate timestamp
    createdAt timestamp
    updatedAt timestamp
  }
  
  Ref: "spots"."spotImages" < "spotImages"."id"
  
  Ref: "users"."id" < "reviews"."userId"
  
  Ref: "spots"."id" < "reviews"."spotId"
  
  Ref: "users"."id" < "spots"."ownerId"
  
  
  Ref: "users"."id" < "bookings"."userId"
  
  Ref: "spots"."id" < "bookings"."spotId"