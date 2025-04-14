const Timeline = ({ logs }) => {
  return (
    <div className="space-y-4">
      {logs.map((log, index) => (
        <div key={log.id} className="flex items-center space-x-4">
          <div className="h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
            {index + 1}
          </div>
          <div className="flex-1">
            <div className="font-semibold">{`De Etapa ${log.from_step_id} para Etapa ${log.to_step_id}`}</div>
            <div className="text-sm text-gray-500">{log.changed_at}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;
