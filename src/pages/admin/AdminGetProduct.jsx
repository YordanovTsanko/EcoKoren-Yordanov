import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiEdit,
  FiTrash2,
  FiCalendar,
  FiPackage,
  FiTag,
  FiLayers,
  FiAlertCircle,
  FiXCircle,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import ConfirmModal from "../../components/modals/ConfirmModal";
import ProductModal from "../../components/modals/ProductModal";
import {
  fetchProductById,
  deleteProduct,
} from "../../store/slices/productsSlice";

const TYPES = [
  { value: "fruits", label: "Плод" },
  { value: "vegetables", label: "Зеленчук" },
  { value: "other", label: "Друго" },
];

const QUANTITIES = [
  { value: "kg", label: "кг." },
  { value: "l", label: "л." },
  { value: "piece", label: "бр." },
];

function formatDate(date) {
  if (!date) return "—";

  return new Intl.DateTimeFormat("bg-BG", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function StatusBadge({ isActive }) {
  if (isActive) {
    return (
      <span className="inline-flex items-center gap-2 rounded-full border border-[#1e4d2b]/10 bg-[#eef4ec] px-3 py-1.5 text-xs font-bold text-[#1e4d2b]">
        <span className="h-2 w-2 rounded-full bg-[#1e4d2b]" />
        Активен
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600">
      <FiXCircle size={13} />
      Неактивен
    </span>
  );
}

function InfoCard({ label, value, icon }) {
  return (
    <div className="rounded-2xl border border-[#102f20]/8 bg-[#fafcf9] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#102f20]/35">
            {label}
          </p>

          <p className="mt-2 truncate text-lg font-black tracking-tight text-[#102f20]">
            {value}
          </p>
        </div>

        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#eef4ec] text-[#1e4d2b]">
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function AdminGetProduct() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { selected, status, error } = useSelector((state) => state.products);

  const [activeImage, setActiveImage] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (selected?.images?.length > 0) {
      setActiveImage(selected.images[0]);
    } else {
      setActiveImage("");
    }
  }, [selected]);

  if (status === "loading") {
    return (
      <section className="min-h-screen bg-[#f5f7f4] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[70vh] w-full max-w-7xl items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="h-11 w-11 animate-spin rounded-full border-4 border-[#1e4d2b]/10 border-t-[#1e4d2b]" />

            <p className="mt-4 text-sm font-semibold text-[#102f20]/45">
              Зареждане на продукта...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen bg-[#f5f7f4] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="mb-5 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#102f20]/10 bg-white px-4 py-2.5 text-sm font-semibold text-[#102f20]/70 shadow-sm transition hover:bg-[#fafcf9]"
          >
            <FiArrowLeft size={16} />
            Назад
          </button>

          <div className="rounded-[24px] border border-red-100 bg-white p-6 shadow-[0_10px_30px_rgba(15,46,31,0.05)]">
            <div className="flex items-start gap-3 rounded-2xl bg-red-50 px-4 py-4 text-red-600">
              <FiAlertCircle size={18} className="mt-0.5 shrink-0" />

              <div>
                <p className="text-sm font-bold">Възникна грешка</p>

                <p className="mt-1 text-sm text-red-600/80">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!selected) {
    return (
      <section className="min-h-screen bg-[#f5f7f4] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center">
          <div className="text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-white text-[#102f20]/20 shadow-sm ring-1 ring-[#102f20]/8">
              <FiPackage size={30} />
            </div>

            <p className="mt-4 text-base font-bold text-[#102f20]/55">
              Продуктът не беше намерен.
            </p>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mt-4 cursor-pointer text-sm font-bold text-[#1e4d2b] hover:underline"
            >
              Върни се обратно
            </button>
          </div>
        </div>
      </section>
    );
  }

  const typeLabel =
    TYPES.find(
      (option) =>
        option.value === selected.type ||
        option.label.toLowerCase() === selected.type?.toLowerCase(),
    )?.label || selected.type;

  const qTypeLabel =
    QUANTITIES.find((option) => option.value === selected.quantityType)
      ?.label || selected.quantityType;

  const currentImageIndex =
    selected.images?.findIndex((image) => image === activeImage) ?? 0;

  const imageCount = selected.images?.length || 0;

  const showPreviousImage = () => {
    if (imageCount <= 1) return;

    const previousIndex =
      currentImageIndex <= 0 ? imageCount - 1 : currentImageIndex - 1;

    setActiveImage(selected.images[previousIndex]);
  };

  const showNextImage = () => {
    if (imageCount <= 1) return;

    const nextIndex =
      currentImageIndex >= imageCount - 1 ? 0 : currentImageIndex + 1;

    setActiveImage(selected.images[nextIndex]);
  };

  const handleDeleteConfirm = async () => {
    if (isDeleting) return;

    setIsDeleting(true);
    setDeleteError("");

    try {
      await dispatch(deleteProduct(id)).unwrap();

      setIsDeleteModalOpen(false);
      navigate("/admin/products");
    } catch (err) {
      setDeleteError(
        typeof err === "string"
          ? err
          : "Изтриването не бе успешно. Опитайте отново.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const totalValue =
    Number(selected.price || 0) * Number(selected.quantity || 0);

  return (
    <section className="min-h-screen bg-[#f5f7f4] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        {/* TOP BAR */}
        <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#102f20]/10 bg-white px-4 py-2.5 text-sm font-semibold text-[#102f20]/70 shadow-sm transition hover:bg-[#fafcf9]"
            >
              <FiArrowLeft size={16} />
              Назад
            </button>

            <div className="mt-4">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1e4d2b]/55">
                Admin / Products / Details
              </div>

              <h1 className="mt-1 text-2xl font-black tracking-tight text-[#102f20] sm:text-3xl">
                Детайли за продукта
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(true)}
              className="flex cursor-pointer items-center gap-2 rounded-xl border border-[#1e4d2b]/10 bg-white px-4 py-2.5 text-sm font-bold text-[#1e4d2b] shadow-sm transition hover:border-[#1e4d2b]/20 hover:bg-[#eef4ec]"
            >
              <FiEdit size={16} />
              Редактирай
            </button>

            <button
              type="button"
              onClick={() => {
                setDeleteError("");
                setIsDeleteModalOpen(true);
              }}
              className="flex cursor-pointer items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-100"
            >
              <FiTrash2 size={16} />
              Изтрий
            </button>
          </div>
        </div>

        {/* MAIN PRODUCT CARD */}
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(440px,0.95fr)]">
          {/* GALLERY */}
          <div className="rounded-[28px] border border-[#102f20]/8 bg-white p-4 shadow-[0_15px_45px_rgba(15,46,31,0.06)] sm:p-5">
            <div className="relative overflow-hidden rounded-[22px] bg-[#eef4ec]">
              <div className="aspect-square">
                {activeImage ? (
                  <img
                    src={activeImage}
                    alt={selected.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center text-[#1e4d2b]/35">
                    <FiPackage size={64} />
                  </div>
                )}
              </div>

              {imageCount > 1 && (
                <>
                  <button
                    type="button"
                    onClick={showPreviousImage}
                    className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-white/90 text-[#102f20] shadow-lg backdrop-blur transition hover:bg-white"
                    aria-label="Предишна снимка"
                  >
                    <FiChevronLeft size={19} />
                  </button>

                  <button
                    type="button"
                    onClick={showNextImage}
                    className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-white/90 text-[#102f20] shadow-lg backdrop-blur transition hover:bg-white"
                    aria-label="Следваща снимка"
                  >
                    <FiChevronRight size={19} />
                  </button>

                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-[#102f20]/75 px-3 py-1 text-[10px] font-bold text-white backdrop-blur">
                    {currentImageIndex + 1} / {imageCount}
                  </div>
                </>
              )}
            </div>

            {imageCount > 0 && (
              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#102f20]/35">
                    Снимки
                  </span>

                  <span className="text-[11px] font-semibold text-[#102f20]/35">
                    {imageCount} {imageCount === 1 ? "снимка" : "снимки"}
                  </span>
                </div>

                <div className="flex gap-2.5 overflow-x-auto pb-1">
                  {selected.images.map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      onClick={() => setActiveImage(image)}
                      className={`relative h-16 w-16 shrink-0 cursor-pointer overflow-hidden rounded-xl border-2 transition ${
                        activeImage === image
                          ? "border-[#1e4d2b] shadow-sm"
                          : "border-transparent opacity-55 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={image}
                        alt=""
                        className="h-full w-full object-cover"
                      />

                      {activeImage === image && (
                        <div className="absolute inset-x-0 bottom-0 h-1 bg-[#1e4d2b]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* PRODUCT INFO */}
          <div className="space-y-6">
            <div className="rounded-[28px] border border-[#102f20]/8 bg-white p-6 shadow-[0_15px_45px_rgba(15,46,31,0.06)] sm:p-7">
              <div className="flex flex-col gap-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-[#eef4ec] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#1e4d2b]">
                        {typeLabel}
                      </span>

                      <StatusBadge isActive={selected.isActive} />
                    </div>

                    <h2 className="mt-4 break-words text-3xl font-black tracking-tight text-[#102f20] sm:text-4xl">
                      {selected.name}
                    </h2>

                    <div className="mt-2 break-all font-mono text-[11px] text-[#102f20]/30">
                      {selected._id}
                    </div>
                  </div>
                </div>

                {/* DESCRIPTION */}
                <div className="border-t border-[#102f20]/8 pt-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#102f20]/35">
                      Описание
                    </h3>
                  </div>

                  <p className="mt-3 whitespace-pre-line text-sm leading-7 text-[#102f20]/70">
                    {selected.description || "Няма описание."}
                  </p>
                </div>

                {/* META */}
                <div className="grid gap-3 border-t border-[#102f20]/8 pt-5 sm:grid-cols-2">
                  <div className="rounded-xl bg-[#fafcf9] px-3.5 py-3">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#102f20]/35">
                      <FiCalendar size={12} />
                      Създаден
                    </div>

                    <div className="mt-1.5 text-xs font-semibold text-[#102f20]/65">
                      {formatDate(selected.createdAt)}
                    </div>
                  </div>

                  {selected.updatedAt && (
                    <div className="rounded-xl bg-[#fafcf9] px-3.5 py-3">
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#102f20]/35">
                        <FiCalendar size={12} />
                        Обновен
                      </div>

                      <div className="mt-1.5 text-xs font-semibold text-[#102f20]/65">
                        {formatDate(selected.updatedAt)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* NUMBERS */}
            <div className="grid gap-4 sm:grid-cols-3">
              <InfoCard
                label="Цена"
                value={`${Number(selected.price || 0).toFixed(2)} лв.`}
                icon={<FiTag size={18} />}
              />

              <InfoCard
                label="Количество"
                value={`${selected.quantity} ${qTypeLabel}`}
                icon={<FiPackage size={18} />}
              />

              <InfoCard
                label="Обща стойност"
                value={`${totalValue.toFixed(2)} лв.`}
                icon={<FiLayers size={18} />}
              />
            </div>

            {/* FEATURES */}
            {selected.features?.length > 0 && (
              <div className="rounded-[28px] border border-[#102f20]/8 bg-white p-6 shadow-[0_15px_45px_rgba(15,46,31,0.05)] sm:p-7">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-black text-[#102f20]">
                      Характеристики
                    </h3>

                    <p className="mt-1 text-xs text-[#102f20]/40">
                      Допълнителна информация за продукта.
                    </p>
                  </div>

                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#eef4ec] text-[#1e4d2b]">
                    <FiCheckCircle size={18} />
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {selected.features.map((feature, index) => (
                    <span
                      key={`${feature}-${index}`}
                      className="rounded-full border border-[#1e4d2b]/10 bg-[#f8faf7] px-3.5 py-2 text-xs font-semibold text-[#1e4d2b]"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeleteError("");
        }}
        onConfirm={handleDeleteConfirm}
        title="Изтриване на продукт"
        message={
          deleteError
            ? deleteError
            : `Сигурни ли сте, че искате да изтриете "${selected.name}"?`
        }
        confirmText="Изтрий"
        cancelText="Отказ"
      />

      <ProductModal
        open={isEditModalOpen}
        edit
        onClose={() => setIsEditModalOpen(false)}
      />
    </section>
  );
}