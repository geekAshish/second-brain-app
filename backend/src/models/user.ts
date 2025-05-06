import { InferSchemaType, model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { config } from "../modules/config/config";
import jwt from "jsonwebtoken";

const UserSchema = new Schema({
  username: {
    type: String,
    required: [true, "Please provide a username"],
    maxlength: 50,
    minlength: 3,
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 6,
  },
});

// This function will be called before saving the user to the database
// and will hash the password using bcryptjs
UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// creating token
UserSchema.methods.createJwt = function () {
  return jwt.sign(
    {
      username: this.username,
      email: this.email,
      userId: this._id,
    },
    config.get("jwtScret"),
    {
      expiresIn: config.get("expiresIn"),
    }
  );
};

// comparing password
UserSchema.methods.comparePassword = async function (userPassword: string) {
  const isMatch = await bcrypt.compare(userPassword, this.password);
  return isMatch;
};

type UserSchemaType = InferSchemaType<any>;

export const User = model<UserSchemaType>("User", UserSchema);
