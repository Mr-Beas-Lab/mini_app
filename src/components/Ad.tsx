import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Autoplay } from 'swiper/modules';
import boinkers from "@/assets/ad/Boinkers.jpg";
import blum from "@/assets/ad/blum.jpg";
import paws from "@/assets/ad/paw.jpg";

const Ad = () => {
  const slides = [
    { 
      title: 'Boinkers', 
      message: 'Get the ultimate degen memecoin $BOINK and become a Shitcoinaire! Our community: @boinkersNews',
      img: boinkers
    },
    { 
      title: 'Blum', 
      message: 'Trade, connect, grow and… farm Blum Points! Made by @blumcrypto team 🌸',
      img: blum
    },
    { 
      title: 'Paws', 
      message: 'Animals are done! It’s PAWS Season 🐾 Join our community @PawsUpFam',
      img: paws
    }
  ];

  return (
    <section className="my-4 sm:my-6 rounded-xl bg-gray-dark mx-4 sm:mx-16 lg:mx-32 p-4">
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        spaceBetween={20}
        slidesPerView={1}
        className="h-auto"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index} className="flex items-center px-6">
            <img 
              src={slide.img} 
              alt={`${slide.title} ad`} 
              className="h-[30px] w-auto object-contain sm:h-[120px] mr-4 sm:mr-6"  
            />
            <div className="flex-1">
              <h1 className="text-white text-lg sm:text-xl font-semibold mb-2">{slide.title}</h1>
              <p className="text-gray-300 text-sm sm:text-base">{slide.message}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Ad;
