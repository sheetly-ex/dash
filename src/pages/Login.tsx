import React from 'react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
      <div className="bg-[#fafafa] p-12 rounded-2xl text-center w-110">
        <div className="w-20 h-20 bg-blue-600 rounded-lg mx-auto mb-8 flex items-center justify-center rotate-3">
          <span className="text-white text-4xl font-black italic">A9</span>
        </div>
        <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">반갑습니다</h1>
        <p className="text-slate-500 mb-10 font-medium">A9 통합 로그인</p>
        <button
          className="w-full py-4 px-4 rounded-lg bg-[#fafafa] border border-slate-200 flex items-center justify-center gap-4 hover:bg-[#fafafa] hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 font-bold text-slate-700 active:scale-[0.97] cursor-pointer"
          onClick={onLogin}
        >
          <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" alt="Google" className="w-6 h-6 mr-2" />
          Google 계정으로 로그인
        </button>
        <div className="mt-8 pt-8 border-t border-slate-100 flex justify-center gap-6">
          <span className="text-xs text-slate-400 font-bold cursor-pointer hover:text-slate-600">아이디 찾기</span>
          <span className="text-xs text-slate-400 font-bold cursor-pointer hover:text-slate-600">비밀번호 재설정</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
