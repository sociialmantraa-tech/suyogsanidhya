import DashboardLayout from '../../src/layouts/DashboardLayout';
import ActivityLogs from '../../src/pages/ActivityLogs';

export default function Page() {
  return (
    <DashboardLayout>
      <ActivityLogs />
    </DashboardLayout>
  );
}
