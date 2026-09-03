// src/features/households/invites/components/CreateInviteButton.tsx
import React, { useState } from 'react';
import { Button, type ButtonProps } from '@/shared/components/ui';
import { CreateInviteModal } from './CreateInviteModal';

export interface CreateInviteButtonProps extends ButtonProps {
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const CreateInviteButton: React.FC<CreateInviteButtonProps> = ({
                                                                          children = '+ Create Invite',
                                                                          variant = 'primary',
                                                                          size = 'sm',
                                                                          onClick,
                                                                          ...props
                                                                      }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(e);
        setIsModalOpen(true);
    };

    return (
        <>
            <Button
                variant={variant}
                size={size}
                onClick={handleClick}
                {...props}
            >
                {children}
            </Button>

            <CreateInviteModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
};