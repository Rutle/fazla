import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { RootState } from '../../reducers/rootReducer';
import RButton from '../RButton/RButton';
import { FormationAction, formationAction } from '../../reducers/slices/formationGridSlice';

interface FormModalProps {
  setModalOpen: (openProp: { modal: string; isOpen: boolean }) => void;
}
const NewFormationModalContent: React.FC<FormModalProps> = ({ setModalOpen }) => {
  const dispatch = useDispatch();
  const config = useSelector((state: RootState) => state.config);
  const [nameVal, setNameVal] = useState('');
  const [typeVal, setTypeVal] = useState('normal');
  const [inputFocus, setInputFocus] = useState(false);

  return (
    <>
      <div className="modal-title">Create new formation</div>
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
                  dispatch(formationAction(FormationAction.New, 0, nameVal, typeVal));
                  setModalOpen({ modal: '', isOpen: false });
                }
              }}
            />
            {nameVal.length > 0 ? (
              <button
                type="button"
                className={`clearIcon ${config.themeColor}`}
                onClick={() => {
                  setNameVal('');
                }}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            ) : (
              <></>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', marginTop: '10px' }}>
          <div className={`radio-group ${config.themeColor}`}>
            <label
              className={`btn graphic ${config.themeColor}${typeVal === 'normal' ? ' selected' : ''}`}
              htmlFor="normal-toggle"
            >
              Normal
              <input
                id="normal-toggle"
                type="radio"
                value="normal"
                checked={typeVal === 'normal'}
                onChange={() => {
                  setTypeVal('normal');
                }}
              />
            </label>

            <label
              className={`btn graphic ${config.themeColor}${typeVal === 'siren' ? ' selected' : ''}`}
              htmlFor="siren-toggle"
            >
              Siren
              <input
                id="siren-toggle"
                type="radio"
                value="siren"
                checked={typeVal === 'siren'}
                onChange={() => {
                  setTypeVal('siren');
                }}
              />
            </label>
          </div>
        </div>
      </div>

      <div className="modal-action">
        <div className="button-group">
          <RButton
            themeColor={config.themeColor}
            onClick={() => {
              dispatch(formationAction(FormationAction.New, 0, nameVal, typeVal));
              setModalOpen({ modal: '', isOpen: false });
            }}
          >
            Create
          </RButton>
          <RButton themeColor={config.themeColor} onClick={() => setModalOpen({ modal: '', isOpen: false })}>
            Cancel
          </RButton>
        </div>
      </div>
    </>
  );
};

export default NewFormationModalContent;

NewFormationModalContent.propTypes = {
  setModalOpen: PropTypes.func.isRequired,
};
