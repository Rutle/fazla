import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
// import { FaTimes } from 'react-icons/fa';
// import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { RootState } from '_/reducers/rootReducer';
import { FormationAction, formationAction } from '_/reducers/slices/formationGridSlice';
import RButton from '../RButton/RButton';
import RToggle from '../RToggle/RToggle';
import { CloseIcon } from '../Icons';

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
              onFocus={(e) => {
                setInputFocus(true);
                e.target.select();
              }}
              onBlur={() => setInputFocus(false)}
              onKeyUp={(e) => {
                if (e.key === 'Enter') {
                  dispatch(
                    formationAction(FormationAction.New, {
                      formationName: nameVal,
                      formationType: typeVal,
                    })
                  );
                  setModalOpen({ modal: '', isOpen: false });
                }
              }}
            />
            {nameVal.length > 0 ? (
              <RButton
                themeColor={config.themeColor}
                className="btn icon"
                onClick={() => {
                  setNameVal('');
                }}
              >
                <CloseIcon themeColor={config.themeColor} />
              </RButton>
            ) : (
              <></>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', marginTop: '10px' }}>
          <div className={`radio-group ${config.themeColor}`}>
            <RToggle
              id="normal-toggle"
              value="normal"
              className="btn normal"
              themeColor={config.themeColor}
              onChange={() => setTypeVal('normal')}
              selected={typeVal === 'normal'}
            >
              Normal
            </RToggle>
            <RToggle
              id="siren-toggle"
              value="siren"
              className="btn normal"
              themeColor={config.themeColor}
              onChange={() => setTypeVal('siren')}
              selected={typeVal === 'siren'}
            >
              Siren
            </RToggle>
          </div>
        </div>
      </div>

      <div className="modal-action">
        <div className={`button-group ${config.themeColor}`} style={{ flexGrow: 1 }}>
          <RButton
            themeColor={config.themeColor}
            onClick={() => {
              dispatch(
                formationAction(FormationAction.New, {
                  formationName: nameVal,
                  formationType: typeVal,
                })
              );
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
