import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal, Form, Select, Input, message } from 'antd'
import type { BaseOptionType } from 'antd/es/select'

import { useStoreState } from 'library/store'
import './RejectOrderModal.style.less'

const { useForm, Item: FormItem } = Form
const { TextArea } = Input

const REASONS_DICTS_NAME = 'taxationSystem'

export interface RejectOrderModalProps {
  opened: boolean
  setOpened: (opened: boolean) => void
  rejectHandler: (reasonCode: number, comment?: string) => Promise<boolean>
}

const RejectOrderModal: React.FC<RejectOrderModalProps> = ({
  opened,
  setOpened,
  rejectHandler,
}) => {
  const { t } = useTranslation()
  const [ form ] = useForm()

  const dictionaries = useStoreState(state => state.dictionary.list)

  const [ reasons, setReasons ] = useState<BaseOptionType[]>([])
  const [ reasonCode, setReasonCode ] = useState<number>()
  const [ comment, setComment ] = useState<string>()

  useEffect(() => {
    if (dictionaries?.[REASONS_DICTS_NAME]) {
      const options = dictionaries[REASONS_DICTS_NAME].map(datum => ({
        label: datum.value,
        value: datum.id,
      }))
      setReasons(options)
    }
  }, [dictionaries])

  const handleReject = async () => {
    if (reasonCode) {
      const result = await rejectHandler(reasonCode, comment)
      if (!result) {
        message.error(t('common.errors.requestError.title'))
      }
      handleClose()
    }
  }

  const handleClose = () => {
    setOpened(false)
    setReasonCode(undefined)
    setComment(undefined)
    form.resetFields()
  }

  const renderModalContent = () => (
    <Form layout="vertical" form={form}>
      <FormItem name="reasonCode"
                label={t('rejectOrderModal.fields.reason')}
                rules={[{ required: true }]}>
        <Select loading={!dictionaries}
                options={reasons}
                onSelect={(value: number) => setReasonCode(value)} />
      </FormItem>
      <FormItem name="comment"
                label={t('rejectOrderModal.fields.comment')}>
        <TextArea rows={6}
                  onChange={e => setComment(e.target.value)} />
      </FormItem>
    </Form>
  )

  return (
    <Modal title={t('rejectOrderModal.title')}
           visible={opened}
           onOk={handleReject}
           onCancel={handleClose}
           okText={t('common.actions.reject.title')}
           okButtonProps={{
             disabled: !reasonCode,
             danger: true,
           }}>
      {renderModalContent()}
    </Modal>
  )
}

export default RejectOrderModal
