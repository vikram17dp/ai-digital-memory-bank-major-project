import React from 'react'

interface AuthLayoutProps {
  children: React.ReactNode;
}

const Authlayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className='flex justify-center pt-40 pb-20'>
      {children}
    </div>
  )
}

export default Authlayout
