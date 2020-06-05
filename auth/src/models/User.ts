import { Schema, model, Model, Document } from 'mongoose';
import { Password } from '../utils/password';

/**
 * Define an interface that describes the properties
 * that are required to create a new user
 */
interface UserAttributes {
  email: string;
  password: string;
}

/**
 * An interface that describes the properties
 * that a User Model has
 */
interface UserModel extends Model<UserDoc> {
  build(attributes: UserAttributes): UserDoc;
}

/**
 * An interface that describes the properties
 * that a User Document has
 */
interface UserDoc extends Document {
  email: string;
  password: string;
}

/**
 * Define user schema
 */
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await Password.hash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

/**
 * Define a static method that builds a new user and teaches TypeScript
 * about all the attributes required for that function.
 */
userSchema.statics.build = (attributes: UserAttributes) => new User(attributes);

// Create a user model and export it
export const User = model<UserDoc, UserModel>('User', userSchema);
