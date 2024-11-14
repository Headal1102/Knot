import { RiDeleteBin6Line } from "react-icons/ri";
import { RiPencilLine } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';
export default function DiaryIcons(props){
    const navigate = useNavigate();
    const userId=sessionStorage.getItem('userId');
    const DiaryCd=props.DiaryCd;
    const userData={
        userId:userId,
        DiaryCd:DiaryCd
    }
    const Delete= async()=>{
        try {
            const response = await fetch(`http://localhost:8080/api/diaries/delete`, {
              method: 'POST',  // 수정할 때는 'POST'로 변경
              headers: {
                'Content-Type': 'application/json',
              },
              body:JSON.stringify(userData),
            });
      
            if (response.ok) {
              alert('삭제 완료.');
              navigate('/main');
            } else {
              alert('삭제 실패.');
            }
          } catch (error) {
            console.error('Error:', error);
            alert('네트워크 오류가 발생했습니다.');
          }
    }
    const Modify=()=>{
        navigate(`/opendiary/${DiaryCd}`);
    }
    return(
        <div id='DiaryIcons'>
                  <RiPencilLine onClick={Modify}/>
                <RiDeleteBin6Line onClick={Delete}/>
        </div>
    )
}