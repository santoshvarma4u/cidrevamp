export function TestSimple() {
  return (
    <div style={{ padding: '50px', backgroundColor: '#ff0000', color: '#ffffff', fontSize: '48px', fontWeight: 'bold', textAlign: 'center', minHeight: '100vh' }}>
      <h1>SIMPLE TEST PAGE - CAN YOU SEE THIS?</h1>
      <div style={{ backgroundColor: '#000000', padding: '20px', margin: '20px', border: '5px solid #ffffff' }}>
        BLACK BOX WITH WHITE BORDER
      </div>
      <div style={{ backgroundColor: '#00ff00', color: '#000000', padding: '20px', margin: '20px', border: '5px solid #000000' }}>
        GREEN BOX WITH BLACK BORDER
      </div>
    </div>
  );
}