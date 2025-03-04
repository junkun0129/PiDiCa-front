import { Modal, ModalProps } from "antd";
import React from "react";
import { SectorDetail } from "../../pages/ReportRegisterPage";
import TextArea from "antd/es/input/TextArea";

type EditSectorModalProps = {
  ModalProps: ModalProps;
  SectorDetail: SectorDetail;
  onChange: (value: string, type: keyof SectorDetail) => void;
};
export const SectorDetailKeysTuple = Object.keys({
  check: "",
  do: "",
  plan: "",
  action: "",
}) as Array<keyof SectorDetail>;
const EditSectorModal = ({
  ModalProps,
  SectorDetail,
  onChange,
}: EditSectorModalProps) => {
  return (
    <Modal {...ModalProps} title={"タスク詳細"}>
      <div className="space-y-4">
        {SectorDetailKeysTuple.map((sector, i) => (
          <div key={"sectoredit-" + i}>
            <label className="block text-sm font-medium text-gray-700">
              {sector.toUpperCase()}
            </label>
            <TextArea
              value={SectorDetail[sector]}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                onChange(e.target.value, sector)
              }
              rows={2}
            />
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default EditSectorModal;
