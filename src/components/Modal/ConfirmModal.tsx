import * as React from 'react';
import styled from 'styled-components';
import keys from '../../constants/storageKeys';
import ModalModel from '../../models/modalModel';
import {StorageUtils} from '../../utils/index';
import CustomCheckbox from '../CustomCheckbox/CustomCheckbox';
import {Button, ConfirmModalProps, StyledModal} from './index';
import ModalHeader from './ModalHeader/ModalHeader';

const confirmStorage = StorageUtils(keys.confirmReminder);

// tslint:disable-next-line:no-var-requires
const {Flex} = require('grid-styled');

const StyledContent = styled.div`
  margin-top: 16px;
  width: 312px;
  font-size: 14px;
  line-height: 1.5;
`;

const StyledReminder = styled.div`
  font-size: 14px;
  line-height: 1.5;
  margin-top: 16px;
`;

const ApplyButton = styled(Button)`
  background-color: #0388ef;
  border: solid 1px #0388ef;
`;

const CancelButton = styled(Button)`
  background: transparent;
  border: solid 1px rgba(140, 148, 160, 0.4);
`;

interface ConfirmModalState {
  isReminderChecked: boolean;
}

class ConfirmModal extends React.Component<
  ConfirmModalProps,
  ConfirmModalState
> {
  constructor(props: ConfirmModalProps) {
    super(props);
    this.state = {
      isReminderChecked: !JSON.parse(confirmStorage.get() || 'true')
    };
  }

  handleChange = () => (e: any) => {
    this.setState({
      isReminderChecked: e.target.checked
    });
  };

  handleApply = (modal: ModalModel) => () => {
    confirmStorage.set(!this.state.isReminderChecked);

    modal.applyAction();
    modal.close();
  };

  handleCancel = (modal: ModalModel) => () => {
    modal.cancelAction();
    modal.close();
  };

  render() {
    const {modal} = this.props;
    return (
      <div>
        <StyledModal>
          <ModalHeader title={'Confirm'} onClick={this.handleCancel(modal)} />
          <StyledContent>Do you really want to {modal.message}?</StyledContent>
          <StyledReminder>
            <CustomCheckbox
              change={this.handleChange()}
              label={`Don't ask me again`}
              checked={this.state.isReminderChecked}
            />
          </StyledReminder>
          <Flex justify={'space-between'} style={{marginTop: '24px'}}>
            <ApplyButton type="button" onClick={this.handleApply(modal)}>
              Yes
            </ApplyButton>
            <CancelButton type="button" onClick={this.handleCancel(modal)}>
              Cancel
            </CancelButton>
          </Flex>
        </StyledModal>
      </div>
    );
  }
}

export default ConfirmModal;
