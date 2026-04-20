const Dashboard = () => {
  return (
    <div className="space-y-6">

      {/* Top Title */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">Overview</h1>
        <p className="text-sm text-gray-500">Welcome back 👋</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Users" value="1,245" />
        <StatCard title="Revenue" value="$12,430" />
        <StatCard title="Orders" value="320" />
      </div>

      {/* Main Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <div className="bg-white p-5 rounded-xl border border-[#F1E5C6]">
          <h2 className="text-sm font-medium text-gray-700 mb-3">
            Recent Activity
          </h2>
          <p className="text-sm text-gray-500">No recent activity</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#F1E5C6]">
          <h2 className="text-sm font-medium text-gray-700 mb-3">
            Quick Stats
          </h2>
          <p className="text-sm text-gray-500">Coming soon...</p>
        </div>

      </div>
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div className="bg-white p-5 rounded-xl border border-[#F1E5C6]">
    <p className="text-sm text-gray-500">{title}</p>
    <h2 className="text-xl font-semibold text-gray-800 mt-1">{value}</h2>
  </div>
);

export default Dashboard;