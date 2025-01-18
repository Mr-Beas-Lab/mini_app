import { useTranslation } from 'react-i18next';

const Ad = () => {
  const { t } = useTranslation();  

  return (
    <section className="my-2 sm:my-4 rounded-xl h-[100px] sm:h-[120px] bg-gray-dark mb-10 mx-6 sm:mx-24 px-4 sm:px-6">
      <h1 className="float-right text-white text-lg sm:text-xl">{t("ad.title")}</h1>
      <p className="text-center text-gray-300">{t("ad.message")}</p>
    </section>
  );
};

export default Ad;
