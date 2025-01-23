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
      img: boinkers // Directly assign the image
    },
    { 
      title: 'Blum', 
      message: 'Trade, connect, grow and… farm Blum Points! Made by @blumcrypto team 🌸',
      img: blum // Directly assign the image
    },
    { 
      title: 'Paws', 
      message: 'Animals are done! It’s PAWS Season 🐾 Join our community @PawsUpFam',
      img: paws // Directly assign the image
    }
  ];

  return (
    <section className="my-2 sm:my-4 rounded-xl bg-gray-dark mb-10 mx-6 sm:mx-24">
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        spaceBetween={30}
        slidesPerView={1}
        className="h-[180px]" 
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index} className="px-4 sm:px-6">
            <div className="h-full flex flex-col justify-center items-center">
              <img 
                src={slide.img} 
                alt={slide.title} 
                className="mb-4 h-[100px] w-auto object-contain"  
              />
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
