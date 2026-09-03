import Hero from "../components/home/Hero.jsx";
import CategoryCards from "../components/home/CategoryCards.jsx";
import ProductSection from "../components/home/ProductSection.jsx";
import Features from "../components/home/Features.jsx";
import { useSelector } from "react-redux";

export default function Home() {
  const allProducts = useSelector((state) => state.products.products);

  return (
    <>
      <Hero />
      <div className="container-eco py-8 sm:py-12">
        <CategoryCards />
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 lg:gap-14 mt-12">
          <ProductSection
            title="ПРОМОЦИИ"
            products={allProducts.filter((p) => p.discount === "yes")}
          />
          <ProductSection
            title="НОВИ ПРОДУКТИ"
            products={allProducts.filter((p) => p.newProduct === "yes")}
          />
        </div>
        <Features />
      </div>
    </>
  );
}
