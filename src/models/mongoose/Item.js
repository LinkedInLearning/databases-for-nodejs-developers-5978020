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

ItemSchema.index({ tags: 1 });
ItemSchema.index({ name: 1 });
ItemSchema.index({ name: "text" });

export const Item = mongoose.model("Item", ItemSchema);
