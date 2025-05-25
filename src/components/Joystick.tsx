import { useEffect, useRef } from 'react';
import nipplejs from 'nipplejs';

const Joystick = () => {
  const joystickRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!joystickRef.current) return;
    const manager = nipplejs.create({
      zone: joystickRef.current,
      mode: 'static',
      position: { left: '60px', bottom: '60px' },
      color: 'gray',
      size: 100,
      restOpacity: 1,
      multitouch: false,
      lockX: false,
      lockY: false,
      threshold: 0.1
    });

    manager.on('move', (evt, data) => {
      if (!data || !data.direction) return;
      const dir = data.direction.angle;
      window.dispatchEvent(new CustomEvent('phaser-move', { detail: dir }));
    });
    manager.on('end', () => {
      window.dispatchEvent(new CustomEvent('phaser-stop'));
    });

    return () => {
      manager.destroy();
    };
  }, []);

  return (
    <div
      ref={joystickRef}
      style={{
        position: 'fixed',
        left: 20,
        bottom: 20,
        width: 120,
        height: 120,
        zIndex: 100,
        touchAction: 'none',
        background: 'transparent'
      }}
    />
  );
};

export default Joystick; 