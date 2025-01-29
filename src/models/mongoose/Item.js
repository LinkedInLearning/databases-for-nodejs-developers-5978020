import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema(
  {
    sku: { type: String, required: true, index: { unique: true } },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    tags: { type: [String], default: [] }
  },
  {
    timestamps: true
  }
);

export const Item = mongoose.model("Item", ItemSchema);
