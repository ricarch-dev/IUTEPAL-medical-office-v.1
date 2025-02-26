import { CircleCheck, CircleX } from 'lucide-react';
import React from 'react';

interface PasswordRequirementsProps {
  password: string;
}

const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({ password }) => {
  const hasContent = password.length > 0;

  const checks = [
    { test: (pwd: string) => pwd.length >= 8, text: 'Al menos 8 caracteres' },
    { test: (pwd: string) => /[A-Z]/.test(pwd), text: 'Al menos una mayúscula' },
    { test: (pwd: string) => /\d/.test(pwd), text: 'Al menos un número' },
    { test: (pwd: string) => /[!@#$%^&*(),.?":{}|<>-]/.test(pwd), text: 'Al menos un carácter especial' },
  ];

  return (
    <div className="mb-10 text-black">
      {checks.map((check, index) => (
        <div key={index} className="flex flex-row items-center gap-2">
          {hasContent &&
            (check.test(password) ? (
              <CircleCheck className="text-green-500" />
            ) : (
              <CircleX className="text-destructive" />
            ))}
          <div
            className={`${hasContent ? (check.test(password) ? 'text-green-500' : 'text-destructive') : 'text-black'} font-bold`}
          >
            {check.text}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PasswordRequirements;
