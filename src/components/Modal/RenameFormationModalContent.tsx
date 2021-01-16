/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import { updateSearch, SearchAction } from '_/reducers/slices/searchParametersSlice';
import RButton from '../RButton/RButton';
import { FormationAction, formationAction } from '../../reducers/slices/formationGridSlice';
import { RootState } from '../../reducers/rootReducer';

// eslint-disable-next-line no-empty-pattern
const RenameFormationModalContent: React.FC<{ setModalOpen: ({}: { modal: string; isOpen: boolean }) => void }> = ({
  setModalOpen,
}) => {
  const dispatch = useDispatch();
  const config = useSelector((state: RootState) => state.config);
  const [nameVal, setNameVal] = useState('');
  const [inputFocus, setInputFocus] = useState(false);

  return (
    <>
      <div className="modal-title">Rename formation</div>
      <div className="modal-content">
        <div>
          <div id="input-group" className={`${config.themeColor} ${inputFocus ? 'input-focus' : ''}`}>
            <input
              id="name-input"
              type="text"
              spellCheck="false"
              className={`${config.themeColor}`}
              placeholder="Formation name"
              value={nameVal}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setNameVal(e.target.value);
              }}
              onFocus={() => setInputFocus(true)}
              onBlur={() => setInputFocus(false)}
              onKeyUp={(e) => {
                if (e.key === 'Enter') {
                  dispatch(formationAction(FormationAction.Rename, 0, nameVal));
                  setModalOpen({ modal: '', isOpen: false });
                }
              }}
            />
            {nameVal.length > 0 ? (
              <div
                className={`clearIcon ${config.themeColor}`}
                onClick={() => {
                  setNameVal('');
                }}
              >
                <FontAwesomeIcon icon={faTimes} />
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>

      <div className="modal-action">
        <div className="button-group">
          <RButton
            themeColor={config.themeColor}
            onClick={() => {
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
