# 기능 명세

## 1. 페이지

### 1A. 병원 페이지

#### 1A1. 구성원

| 컴포넌트 | Members.tsx                                                                   |
| -------- | ----------------------------------------------------------------------------- |
| 소개     | 해당 병원의 구성원 목록을 볼 수 있다. 구성원의 권한에 관련된 작업을 수행한다. |

- 구성원 목록을 표시한다.
- 구성원은 아래 **구성원 정보를 포함**한다.
  - 이름
  - 상태
    - 관리자
    - 직원
    - 승인대기(관리자가 초대했지만 아직 초대수락을 하지 않은 상태)
  - 아바타 사진
  - 부서(원장, 접수, 물리치료실, 행정 등등)
  - 관리자는 승인대기 상태인 구성원일 경우 초대취소를 할 수 있다.

<p align="center">
    <img width="700" alt="대시보드_구성원" src="https://user-images.githubusercontent.com/77876601/201843755-f7167cf6-ac88-455b-8d47-479ee3d65941.png">
    <span>대시보드 구성원</span>
</p>

#### 1A2. 초대

| 컴포넌트 | InviteClinic.tsx                    |
| -------- | ----------------------------------- |
| 소개     | 해당 병원에 새로 구성원을 초대한다. |

- 초대할 사람 이름을 입력한다.
  1. 입력한 사람이 있는가?
  - 1의 제한사항을 통과하지 못하면 알림메시지를 출력하고 초대 실패한다.
- 제한사항을 통과하면 초대되고 알림메시지를 출력한다.

<p align="center">
    <img width="700" alt="대시보드_초대" src="https://user-images.githubusercontent.com/77876601/201843781-9a15cca7-5391-4ea6-9a73-cd2dc5236282.png">    
    <span>대시보드 초대</span>
</p>

#### 1A3. 처방

| 컴포넌트 | PrescriptionPage.tsx                                   |
| -------- | ------------------------------------------------------ |
| 소개     | 해당 병원의 처방의 목록을 보고, 정보를 수정할 수 있다. |

- 처방 목록을 표시한다
- 처방 목록은 아래 **처방 정보를 포함**한다.
  - 이름
  - 카테고리(충격파, 도수치료 등등)
  - 상태(활성, 비활성)
    - 더 이상 사용하지 않을 처방은 **비활성**할 수 있다.
      - 비활성 된 처방은 화면에 표시하거나 감출 수 있다.
  - 소요 시간
  - 가격
  - 설명
- 관리자는 처방의 정보를 수정할 수 있다.

- 처방 만들기 폼
  - 카테고리
  - 이름
  - 소요 시간
  - 가격
  - 설명

<p align="center">
    <img width="700" alt="대시보드_처방" src="https://user-images.githubusercontent.com/77876601/201843832-0b068f8d-9ed9-4b2b-a626-f073b9075c7f.png">    
    <span>대시보드 처방</span>
</p>
<p align="center">
    <img width="700" alt="대시보드_처방__설명확장" src="https://user-images.githubusercontent.com/77876601/201843847-19c58144-4991-4be5-9a49-bac6ef71fd3f.png">    
    <span>대시보드 처방 설명확장</span>
</p>
<p align="center">
    <img width="700" alt="대시보드_처방__만들기" src="https://user-images.githubusercontent.com/77876601/201843856-8feaa82e-b509-4de9-89bb-22cab9bcb74f.png">    
    <span>대시보드 처방 만들기</span>
</p>

#### 1A4. 통계

| 컴포넌트   | Statistics.tsx                                                                             |
| ---------- | ------------------------------------------------------------------------------------------ |
| 소개       | 예약 통계를 볼 수 있다. 표와 그래프로 이뤄진다.                                            |
| 라이브러리 | [https://formidable.com/open-source/victory/](https://formidable.com/open-source/victory/) |

- 기간별 통계를 조회한다.

  - 연도를 선택할 수 있다.
  - 월을 선택할 수 있다.
  - (선택)일을 선택할 수 있다.
  - 조회할 치료사를 선택할 수 있다.

- 통계 값은 예약의 수, 치료한 시간, 금액 등 변할 수 있다.
- 예시) 표1

| 이름       | 김치료 | 이치료 | 삼치료 | 사치료 | 합계  |
| ---------- | ------ | ------ | ------ | ------ | ----- |
| 충격파1000 | 170    | 90     | 120    | 221    | 601   |
| 충격파2000 | 170    | 90     | 120    | 221    | 601   |
| 도수치료1  | 170    | 90     | 120    | 221    | 601   |
| 도수치료2  | 170    | 90     | 120    | 221    | 601   |
| MTEST50    | 170    | 90     | 120    | 221    | 601   |
| 합계       | 850    | 450    | 600    | 1,105  | 3,005 |

- 예시) 표2

| 이름               | 김치료 | 박치료 | 이치료 | 합계 |
| ------------------ | ------ | ------ | ------ | ---- |
| 예약               | 201    | 180    | 188    | 500  |
| 신규               | 10     | 4      | 12     | 26   |
| 부도               | 20     | 19     | 14     | 53   |
| 취소               | 4      | 9      | 4      | 17   |
| 방문한지 30일 경과 | 3      | 2      | 0      | 5    |

- 그래프
  - 위 예시의 내용을 그래프로 표현한다.
  - 일별 예약, 신규 환자, 부도, 취소 등을 그래프로 표시
    - 1일에 20명, 2일에 24명, 3일에 28명..., 29일에 20명, 30일에 10명
    - 시간의 흐름에 따라 추이 파악 목적

<p align="center">
    <img width="700" alt="대시보드_통계__표" src="https://user-images.githubusercontent.com/77876601/201843999-848cabbf-0497-48e4-8627-ba4395dd07d1.png">    
    <span>대시보드 통계 표</span>
</p>
<p align="center">
    <img width="700" alt="대시보드_통계__그래프" src="https://user-images.githubusercontent.com/77876601/201844024-9208f2ff-5763-4371-b400-23dfd23c1747.png">    
    <span>대시보드 통계 그래프</span>
</p>

---

### 1B. 프로필 페이지

#### 1B1. 나의 정보

| 컴포넌트 | EditProfile.tsx(MyProfile.tsx 변경 예정)                  |
| -------- | --------------------------------------------------------- |
| 소개     | 로그인한 사용자의 개인 정보를 표시하고 수정하는 화면이다. |

- 아래 **사용자 정보를 표시**한다.

  - 이름
  - e-mail

- 아래 **사용자 정보를 수정**할 수 있다.
  - 이름
  - 비밀번호
  - e-mail
    - 폼에 바꿀 이메일 주소를 입력
      - 바꿀 이메일 주소로 인증 메일 전송
    - 인증 이메일 전송됐음을 알림
    - 받은 인증 메일에서 확인 클릭
    - 이메일 변경 완료

<p align="center">
    <img width="700" alt="프로필_나의정보" src="https://user-images.githubusercontent.com/77876601/201844082-504858db-1c9f-444d-9d68-028f991a0c96.png">    
    <span>프로필 나의정보</span>
</p>
<p align="center">
    <img width="700" alt="프로필_나의정보__이메일변경" src="https://user-images.githubusercontent.com/77876601/201844100-2f7a80ae-5706-4210-a23d-8dfc75903f05.png">    
    <span>프로필 나의정보 이메일변경</span>
</p>

#### 1B2. 나의 병원

| 컴포넌트 | MyClinics.tsx                                                                            |
| -------- | ---------------------------------------------------------------------------------------- |
| 소개     | 이제까지 가입했던 모든 병원 목록을 볼 수 있다. 병원 가입, 탈퇴와 관련된 작업을 수행한다. |

- 모든 병원 목록을 표시한다(탈퇴한 병원 포함).

  - 병원 상태는 4개다

    - 가입한 병원
    - 탈퇴한 병원
    - 문 닫은 병원

  - 병원에 속한 사용자의 상태 3개다.

    - 초대를 받고 수락을 한 사람(직원)
    - 초대를 받고 수락을 하지 않은 사람(승인대기)
      - 승인대기자는 초대를 수락하거나 거절할 수 있다.
    - 병원을 개설한 사람(관리자)
      - 관리자는 병원을 폐쇄할 수 있다(병원을 더 이상 사용하지 않아 비활성화 상태로 만듦)

<p align="center">
    <img width="700" alt="프로필_나의병원" src="https://user-images.githubusercontent.com/77876601/201844133-7d73c3c5-5063-4526-9bac-81a7bff52bb0.png">    
    <span>프로필 나의병원</span>
</p>
<p align="center">
    <img width="700" alt="프로필_나의병원__비활성하기" src="https://user-images.githubusercontent.com/77876601/201844144-79e4eb3f-6450-4cc0-a1f5-08a5dfa5bbca.png">    
    <span>프로필 나의병원 비활성하기 </span>
</p>

#### 1B3. 병원 만들기

| 컴포넌트 | CreateClinic.tsx                                                                                                            |
| -------- | --------------------------------------------------------------------------------------------------------------------------- |
| 소개     | 새로운 병원을 개설한다. 카카오톡에서 새로운 채팅방을 만드는 것과 같은 작업이다. 카카오톡 채팅방이 병원이라고 생각하면 된다. |

- 병원 이름을 입력한다.
  1. 동일한 이름의 병원이 있는가?
  2. 병원 생성 제한 수를 넘지 않았는가?
  - 1, 2의 제한사항을 통과하지 못하면 알림메시지를 출력하고 실패한다.
- 제한사항을 통과하면 병원이 개설되고 알림메시지를 출력한다.

<p align="center">
    <img width="700" alt="프로필_병원만들기" src="https://user-images.githubusercontent.com/77876601/201844208-9b880847-3b0e-4717-89db-85f9b43b9151.png">
    <span>프로필 병원만들기</span>
</p>