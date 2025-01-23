import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Autoplay } from 'swiper/modules';
 const Ad = () => {
  const { t } = useTranslation();

  const slides = [
    { title: t("ad.title1"), message: t("ad.message1") },
    { title: t("ad.title2"), message: t("ad.message2") },
    { title: t("ad.title3"), message: t("ad.message3") },
  ];

  return (
    <section className="my-2 sm:my-4 rounded-xl bg-gray-dark mb-10 mx-6 sm:mx-24">
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        spaceBetween={30}
        slidesPerView={1}
        className="h-[120px]"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index} className="px-4 sm:px-6">
            <div className="h-full flex flex-col justify-center items-center">
              <h1 className="text-white text-lg sm:text-xl mb-2">{slide.title}</h1>
              <p className="text-center text-gray-300">{slide.message}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Ad;
