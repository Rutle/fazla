import React from 'react';
import { useDropdownMenu } from 'react-overlays';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../reducers/rootReducer';

interface FormationDropDownProps {
  role: string;
}

const DropDownMenu: React.FC = () => {
  const dispatch = useDispatch();
  const appState = useSelector((state: RootState) => state.appState);
  const { show, props } = useDropdownMenu({
    flip: true,
    offset: [0, 8],
  });
  return (
    <div
      {...props}
      role="menu"
      className="formation-dropdown-menu dark"
      style={{
        opacity: `${show ? '1' : '0'}`,
        height: `${show ? 'auto' : '0'}`,
      }}
    >
      {appState.formationPage !== undefined ? (
        appState.formationPage.formations.map((value, index) => {
          return (
            <button key={`${value.name}${index}`} type="button" className="btn menu-item dark">
              {value.name}
            </button>
          );
        })
      ) : (
        <></>
      )}
    </div>
  );
};

export default DropDownMenu;
