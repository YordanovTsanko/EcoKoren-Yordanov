import { useDispatch } from "react-redux";
import { addToCart } from "../../store/slices/cartSlice";
import { motion } from "framer-motion";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const isDiscount = product.discount === "yes" || product.discount === true;
  const isNew = product.newProduct === "yes" || product.newProduct === true;

  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="bg-white rounded-xl border border-[#e6efe3] shadow-sm hover:shadow-md transition group/card flex flex-col h-full overflow-hidden"
    >
      <div className="relative aspect-[4/3] bg-[#f8faf7] overflow-hidden rounded-t-xl shrink-0">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover/card:scale-105 transition duration-500"
        />
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isDiscount && product.discountPercent && (
            <span className="bg-[#c81e1e] text-white text- font-bold px-2 py-0.5 rounded-md">
              -{product.discountPercent}%
            </span>
          )}
          {isNew && (
            <span className="bg-[#1e4d2b] text-white text- font-bold px-2 py-0.5 rounded-md">
              НОВО
            </span>
          )}
        </div>
        <button
          onClick={() => dispatch(addToCart(product))}
          className="absolute bottom-2 right-2 opacity-0 group-hover/card:opacity-100 bg-white/95 px-2.5 py-1.5 rounded-md text- font-semibold shadow"
        >
          + Количка
        </button>
      </div>

      <div className="p-3 flex flex-col flex-1">
        <div
          className="relative group/name shrink-0 overflow-hidden rounded-md"
          style={{ height: "50px", minHeight: "50px" }}
        >
          <h3
            className="text- sm:text- font-medium text-[#1d3124] leading- line-clamp-2 break-all"
            style={{
              height: "50px",
              lineHeight: "25px",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              wordBreak: "break-all",
              overflowWrap: "anywhere",
            }}
          >
            {product.name}
          </h3>
          <div className="absolute inset-0 z-20 hidden group-hover/name:block bg-[#1d3124] px-2 py-1 rounded-md">
            <p className="text- leading- text-white break-all line-clamp-5">
              {product.name}
            </p>
          </div>
        </div>

        <div className="mt-2 flex items-baseline gap-2">
          {isDiscount && product.oldPrice && (
            <span className="text- text-[#8a9a8f] line-through">
             € {product.oldPrice.toFixed(2)}
            </span>
          )}
          <span className="text- font-bold text-[#123123]">
           € {product.price.toFixed(2)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}