import React, { useEffect, useState } from 'react';

const VelocitySimulation = () => {
  const [linearPos, setLinearPos] = useState({ x: 50, speed: 1 });
  const [tangentDistance, setTangentDistance] = useState(10);
  const [numSteps, setNumSteps] = useState(33);
  const [circularState, setCircularState] = useState({
    x: 200,
    y: 90,
    angle: 0,
    inTangentMotion: true,
    targetX: 0,
    targetY: 0
  });

  // Linear motion with continuous acceleration
  useEffect(() => {
    const interval = setInterval(() => {
      setLinearPos(prev => {
        const newSpeed = prev.speed + 0.05;
        const newX = prev.x + newSpeed;
        
        if (newX > 350) {
          return { x: 50, speed: 1 };
        }
        return { x: newX, speed: newSpeed };
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Circular motion with distinct tangent and force phases
  useEffect(() => {
    const radius = 60;
    const centerX = 200;
    const centerY = 150;
    const angleIncrement = 360 / numSteps;
    
    const moveInTangent = () => {
      const angle = circularState.angle * (Math.PI / 180);
      const tangentX = circularState.x + Math.cos(angle) * tangentDistance;
      const tangentY = circularState.y + Math.sin(angle) * tangentDistance;
      
      setCircularState(prev => ({
        ...prev,
        x: tangentX,
        y: tangentY,
        inTangentMotion: true
      }));
    };

    const applyForce = () => {
      const nextAngle = circularState.angle + angleIncrement;
      const targetX = centerX + radius * Math.cos((nextAngle - 90) * (Math.PI / 180));
      const targetY = centerY + radius * Math.sin((nextAngle - 90) * (Math.PI / 180));
      
      setCircularState(prev => ({
        ...prev,
        x: targetX,
        y: targetY,
        angle: nextAngle % 360,
        inTangentMotion: false
      }));
    };

    const interval = setInterval(() => {
      if (circularState.inTangentMotion) {
        applyForce();
      } else {
        moveInTangent();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [circularState, tangentDistance, numSteps]);

  const handleDistanceChange = (event) => {
    setTangentDistance(Number(event.target.value));
  };

  const handleStepsChange = (event) => {
    setNumSteps(Number(event.target.value));
  };

  return (
    <div className="w-full max-w-4xl p-4">
      <div className="space-y-12">
        {/* Linear acceleration */}
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Speed Changes, Direction Remains Same</h3>
          <p className="mb-4 text-sm text-gray-600">Force acts in direction of travel</p>
          <div className="mb-2">Speed: {linearPos.speed.toFixed(2)} units/s</div>
          <svg className="w-full h-32">
            <line 
              x1="40" y1="60" x2="360" y2="60" 
              stroke="#666" 
              strokeWidth="1" 
              strokeDasharray="4 2"
            />
            
            <circle 
              cx={linearPos.x} 
              cy="60" 
              r="8" 
              fill="#2563eb"
            />
            
            <g transform={`translate(${linearPos.x},60)`}>
              <line 
                x1="0" y1="0" 
                x2={25 * linearPos.speed} y2="0" 
                stroke="#ef4444" 
                strokeWidth="2"
              />
              <polygon 
                points={`${25 * linearPos.speed},0 ${25 * linearPos.speed - 6},-4 ${25 * linearPos.speed - 6},4`}
                fill="#ef4444"
              />
            </g>
          </svg>
        </div>

        {/* Circular motion */}
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Speed Remains Same, Direction Changes</h3>
          <p className="mb-4 text-sm text-gray-600">Force acts at right angles to direction of travel</p>
          
          {/* Controls */}
          <div className="space-y-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Steps per Rotation: {numSteps} steps ({(360/numSteps).toFixed(1)}° per step)
              </label>
              <input 
                type="range" 
                min="8" 
                max="64" 
                value={numSteps} 
                onChange={handleStepsChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tangential Distance: {tangentDistance} units
              </label>
              <input 
                type="range" 
                min="1" 
                max="100" 
                value={tangentDistance} 
                onChange={handleDistanceChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          <svg className="w-full h-64">
            <circle 
              cx="200" cy="150" r="60" 
              stroke="#666" 
              strokeWidth="1" 
              strokeDasharray="4 2" 
              fill="none"
            />
            
            <circle 
              cx={circularState.x} 
              cy={circularState.y} 
              r="8" 
              fill="#2563eb"
            />
            
            {/* Velocity vector */}
            <g transform={`translate(${circularState.x},${circularState.y}) rotate(${circularState.angle})`}>
              <line 
                x1="0" y1="0" 
                x2="20" y2="0" 
                stroke="#ef4444" 
                strokeWidth="2"
              />
              <polygon 
                points="20,0 14,-4 14,4" 
                fill="#ef4444"
              />
            </g>
            
            {/* Force vector */}
            {!circularState.inTangentMotion && (
              <g transform={`translate(${circularState.x},${circularState.y}) rotate(${circularState.angle + 90})`}>
                <line 
                  x1="0" y1="0" 
                  x2="20" y2="0" 
                  stroke="#ef4444" 
                  strokeWidth="2"
                />
                <polygon 
                  points="20,0 14,-4 14,4" 
                  fill="#ef4444"
                />
              </g>
            )}
          </svg>
        </div>
      </div>
    </div>
  );
};

export default VelocitySimulation;