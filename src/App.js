import React, { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Define draggable component
const DraggableBox = ({ id, left, top, hideSourceOnDrag, children }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'box',
    item: () => ({ id, content: children }), // Include content in the item
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  if (isDragging && hideSourceOnDrag) {
    return <div ref={drag} />;
  }

  return (
    <div ref={drag} style={{ left, top, position: 'absolute' }}>
      {children}
    </div>
  );
};

// Define droppable component
const DroppableBox = ({ id, onDrop, children }) => {
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: 'box',
    drop: (item) => onDrop(item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const isActive = canDrop && isOver;

  return (
    <div ref={drop} style={{ width: '100%', height: '100%' }}>
      {children}
      {isActive && <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, opacity: 0.5, backgroundColor: 'yellow' }} />}
    </div>
  );
};

// Define header component
const Header = ({ droppedItems }) => {
  return (
    <div style={{ width: '100%', height: '50px', backgroundColor: 'lightblue', textAlign: 'center', lineHeight: '50px' }}>
      Dropped Items: {droppedItems.map(item => item.content).join(', ')} {/* Display content instead of ID */}
    </div>
  );
};

// Example usage
const App = () => {
  const [droppedItems, setDroppedItems] = useState([]);

  const handleDrop = (item) => {
    // Handle drop logic here
    console.log('Dropped item:', item);
    setDroppedItems([...droppedItems, item]);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ position: 'relative', width: '400px', height: '400px', border: '1px solid black' }}>
        <Header droppedItems={droppedItems} />
        <DroppableBox id="header" onDrop={handleDrop}>
          <div style={{ width: '100%', height: '50px', backgroundColor: 'lightgray', textAlign: 'center', lineHeight: '50px' }}>Drop Here</div>
        </DroppableBox>
        <DroppableBox id="box1" onDrop={handleDrop}>
          <DraggableBox id="box1" left={50} top={100}>
            Field 1!
          </DraggableBox>
        </DroppableBox>
        <DroppableBox id="box2" onDrop={handleDrop}>
          <DraggableBox id="box2" left={200} top={100}>
            Field 2!
          </DraggableBox>
        </DroppableBox>
      </div>
    </DndProvider>
  );
};

export default App;
