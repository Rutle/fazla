import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../reducers/rootReducer';
import PropTypes from 'prop-types';
import RButton from '../RButton/RButton';
import { FormationAction, formationAction } from '../../reducers/slices/formationGridSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import { updateSearch, SearchAction } from '_/reducers/slices/searchParametersSlice';

const RenameFormationModalContent: React.FC<{ setModalOpen: ({}:{ modal: string, isOpen: boolean }) => void }> = ({ setModalOpen }) => {
  const dispatch = useDispatch();
  const config = useSelector((state: RootState) => state.config);
  const [nameVal, setNameVal] = useState('');
  const [inputFocus, setInputFocus] = useState(false);

  return (
    <>
      <div className="modal-title">Rename formation</div>
      <div className="modal-content">
        <div>
        <form>
          <div id="input-group" className={`${config.themeColor} ${inputFocus ? 'input-focus' : ''}`}>
            <input
              id="name-input"
              type="text"
              className={`${config.themeColor}`}
              placeholder={'Formation name'}
              value={nameVal}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setNameVal(e.target.value);
              }}
              onFocus={() => setInputFocus(true)}
              onBlur={() => setInputFocus(false)}
            />
            {nameVal.length > 0 ? (
            <div className={`clearIcon ${config.themeColor}`} onClick={() => {
              setNameVal('');
            }}>
              <FontAwesomeIcon icon={faTimes} />
            </div> ) : <></>}
          </div> 
        </form>
        </div>
      </div>

      <div className="modal-action">
        <div className="button-group">
          <RButton
            themeColor={config.themeColor}
            onClick={() => {
              console.log(nameVal);
              dispatch(formationAction(FormationAction.Rename, 0, nameVal));
              setModalOpen({ modal: '', isOpen: false });
            }}
          >
            Rename
          </RButton>
          <RButton themeColor={config.themeColor} onClick={() => setModalOpen({ modal: '', isOpen: false })}>
            Cancel
          </RButton>
        </div>
      </div>
    </>
  );
};

export default RenameFormationModalContent;

RenameFormationModalContent.propTypes = {
  setModalOpen: PropTypes.func.isRequired,
};
