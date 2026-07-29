import * as React from "react";
import { QRCodeSVG } from "qrcode.react";

interface QRDisplayProps {
  qrToken?: string;
  qrImageUrl?: string;
  memberName?: string;
  employeeId?: string | null;
  departmentName?: string | null;
  className?: string;
  size?: number;
}

export function QRDisplay({
  qrToken = "UNITE_PASSPORT_EMP_102_SECURE_TOTP_TOKEN",
  qrImageUrl,
  memberName,
  employeeId,
  departmentName,
  className = "",
  size = 200,
}: QRDisplayProps) {
  return (
    <div className={`flex flex-col items-center justify-center w-full max-w-full min-w-0 ${className}`}>
      <div className="relative p-4 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center shadow-inner w-full max-w-full min-w-0 overflow-hidden">
        {qrImageUrl ? (
          <img src={qrImageUrl} alt={`QR Code for ${memberName || 'member'}`} className="w-48 h-48 object-contain max-w-full" />
        ) : (
          <QRCodeSVG
            value={qrToken}
            size={size}
            level="H"
            includeMargin={true}
            bgColor="transparent"
            fgColor="currentColor"
            className="text-zinc-900 dark:text-white max-w-full h-auto"
          />
        )}
        <p className="text-[9px] sm:text-[10px] text-zinc-400 dark:text-zinc-500 font-mono mt-2 tracking-wider uppercase text-center w-full max-w-[240px] truncate block overflow-hidden px-1">
          {qrToken}
        </p>
      </div>

      {memberName && (
        <div className="mt-4 text-center w-full max-w-full min-w-0">
          <h4 className="text-base font-extrabold text-zinc-900 dark:text-white truncate">{memberName}</h4>
          {(employeeId || departmentName) && (
            <p className="text-xs text-zinc-500 font-medium mt-0.5 truncate">
              {[employeeId, departmentName].filter(Boolean).join(" • ")}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
