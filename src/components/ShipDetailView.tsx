import React, { useState } from 'react';
import PageTemplate from './PageTemplate';
import ShipList from './ShipList';
import ShipDetails from './ShipDetails';

const ShipDetailView: React.FC = () => {
  const [listToggle, setListToggle] = useState('all');

  /*
  useEffect(() => {
    switch (listToggle) {
      case 'all':
        break;
      default:
        break;
    }
  }, [listToggle]);
  */


  return (
    <PageTemplate>
      <section id="ship-list-page-content">
        <ShipList listToggle={listToggle} setListToggle={setListToggle} />
        <div id="ship-data">
          <ShipDetails toggle={listToggle} />
        </div>
      </section>
    </PageTemplate>
  );
};

export default ShipDetailView;
