import Ad from '@/components/Ad';
import DailyCheckIn from '@/components/Daily-Checkin';
import DailyTasks from '@/components/Daily-Tasks';

const Earn = () => {
  return (
    <section className="mb-24">
 
      {/* Daily Check-In */}
      <Ad />
      <DailyCheckIn />
      {/* Daily Tasks */}
      <DailyTasks />
    </section>
  );
};

export default Earn;
