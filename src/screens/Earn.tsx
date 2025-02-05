import Ad from '@/components/Ad';
import DailyCheckIn from '@/components/Daily-Checkin';
import DailyTasks from '@/components/Daily-Tasks';
import stars from "@/assets/icons/stars.svg";


const Earn = () => {
  return (
    <section className="mb-24 ">
      <img src={stars} alt="" className='absolute -z-10 top-10 left-56 w-32 h-32 '/>
      {/* Daily Check-In */}
      <Ad />
      <DailyCheckIn />
      {/* Daily Tasks */}
      <DailyTasks />
    </section>
  );
};

export default Earn;
