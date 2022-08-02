import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal, Form, Select, Input } from 'antd'

import { useStoreState } from 'library/store'
import './RejectOrderModal.style.less'

const { useForm, Item: FormItem } = Form
const { Option } = Select
const { TextArea } = Input

const REASONS_DICTS_NAME = 'taxationSystem'

export interface RejectOrderModalProps {
  opened: boolean
  setOpened: (opened: boolean) => void
  rejectHandler: (code: number, reason: string) => Promise<boolean>
}

const RejectOrderModal: React.FC<RejectOrderModalProps> = ({
  opened,
  setOpened,
  rejectHandler,
}) => {
  const { t } = useTranslation()

  const dictionaries = useStoreState(state => state.dictionary.list)
  const [ reasonCode, setReasonCode ] = useState<number>()
  const [ comment, setComment ] = useState<string>()

  const handleReject = () => {
    rejectHandler(0, '')
  }

  console.log('reasonCode', reasonCode)
  console.log('comment', comment)

  const renderModalContent = () => (
    <Form layout="vertical">
      <FormItem name="reasonCode"
                label={t('rejectOrderModal.fields.reason')}

                rules={[{ required: true }]}>
        <Select loading={!dictionaries}
                onSelect={(value: number) => setReasonCode(value)}>
          {dictionaries?.[REASONS_DICTS_NAME]?.map(item => (
            <Option key={item.id} value={item.id}>
              {item.value}
            </Option>
          ))}
        </Select>
      </FormItem>
      <FormItem name="comment"
                label={t('rejectOrderModal.fields.comment')}
                >
        <TextArea rows={6} onChange={e => setComment(e.target.value)} />
      </FormItem>
    </Form>
  )
  return (
    <Modal title={t('rejectOrderModal.title')}
           visible={opened}
           onOk={handleReject}
           okText={t('common.actions.reject.title')}
           okButtonProps={{
             disabled: !reasonCode,
             danger: true,
           }}
           onCancel={() => setOpened(false)}>
      {renderModalContent()}
    </Modal>
  )
}

export default RejectOrderModal
