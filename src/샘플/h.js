import { useNavigate } from 'react-router-dom';

function HistorySample() {
   const navigate = useNavigate();
   const goBack = () => {
   const confirm = window.confirm('편집을 완료하셨습니까?')
   if (confirm) {
      navigate(-1);
    }
  };

const goHome = () => {
    navigate('/');
  }
  return (
    <div>
      <button onClick={goBack}>뒤로가기</button>
      <button onClick={goHome}>홈으로</button>
    </div>
  );
}
export default HistorySample;