import { Card, CardContent } from "../ui/card";
import { MyButton } from "../atoms/Button";
import { Scanner } from "@yudiel/react-qr-scanner";
import type { IDetectedBarcode } from "@yudiel/react-qr-scanner";
import { IconX } from "@tabler/icons-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onScan: (result: string) => void;
}

export function QrScannerModal({ open, onClose, onScan }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/50">
      <Card>
        <CardContent className="flex flex-col gap-2">
          <div className="flex justify-end">
            <MyButton onClick={onClose} className="w-8 h-8">
              <IconX />
            </MyButton>
          </div>
          <Scanner
            onScan={(codes: IDetectedBarcode[]) => {
              if (codes.length > 0) {
                onScan(codes[0].rawValue);
              }
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
