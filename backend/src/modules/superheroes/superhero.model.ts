import { Schema, model } from 'mongoose';

const ImageSchema = new Schema({
  url: String,
  filename: String,
  createdAt: { type: Date, default: Date.now }
});

const SuperheroSchema = new Schema(
  {
    nickname: { type: String, required: true },
    real_name: { type: String, required: true },
    origin_description: String,
    superpowers: [String],
    catch_phrase: String,
    images: [ImageSchema]
  },
  { timestamps: true }
);

export const Superhero = model('Superhero', SuperheroSchema);
