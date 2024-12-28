# Nbbnag

[https://nbbang.life/](https://nbbang.life/)

<p align="center">
  <img src="https://github.com/moonjunyoung/nbbang/assets/110980148/f5abe421-22db-4e43-9583-dbaf3ac58886" alt="nbbang_Logo">
</p>

# 프로젝트 비전

모임에서 사용된 금액을 나누어 편리하게 정산하는 웹 애플리케이션 입니다.

## 모임

정산을 진행하기 위해 첫 번쨰로 해야 할 것은 모임 생성입니다.
사용자가 모임을 생성할 때 아래 기본값으로 모임이 생성되며, 이후 모임명과 날짜를 수정할 수 있습니다.

- 기본 모임명 : 모임명을 설정해 주세요
- 기본 모임 날짜 : 모임 생성일

## 멤버

정산을 진행하기 위해 두 번쨰로 해야할 것은 멤버 추가입니다.
사용자는 모임에 함께한 멤버들의 이름을 추가해야 합니다.
모임에 최초로 추가된 멤버는 자동으로 총무로 지정이 됩니다.
총무를 다른 멤버로 변경 하고자 하면, 변경하고자 하는 멤버의 버튼을 클릭하여 수정할 수 있습니다.

### 총무

총무는 모임당 한 명만 존재할 수 있으며,
모임의 사용 금액은 총무가 관리하게 됩니다.

- 모임에서 결제한 금액이 사용한 금액보다 높은 멤버 : 총무가 해당 멤버에게 차액을 입금해야 합니다.
- 모임에서 결제한 금액이 없거나 사용한 금액보다 낮은 멤버 : 총무에게 사용 금액을 입금해야 합니다.

## 결제내역

정산을 진행하기 위해 세 번째로 해야할 것은 결제내역 추가입니다.
사용자는 모임에서 사용된 결제내역에 대한 정보 ( 결제장소, 결제금액, 결제한 멤버, 함께한 멤버들 ) 를 입력해야합니다.

## 정산

위 3가지를 입력하면 결제내역에 입력된 멤버들을 기준으로 금액이 나누어지게 되며,
멤버들이 총무에게 보내야 할 돈이 계산이 됩니다.

## 입금정보

> 입금정보 등록 서비스는 모바일에서만 가능합니다.

총무가 멤버들에게 정산금액을 입금 받을때 토스, 카카오 를 통해서 입금 받을 수 있습니다.
해당 서비스를 이용하기 위해서는 아래 두가지 정보를 등록해야합니다.

- 토스 : 계좌정보 ( 은행명, 계좌번호 )
- 카카오 : 카카오등록시에 이번에만 사용하기, 계속해서 사용하기를 선택할 수 있습니다.
- 이번에만 사용하기 : 해당 모임에서만 입력한 입금정보가 사용이 됩니다.
- 계속해서 사용하기 : 이후 생성하는 모임에 입력한 입금정보가 자동으로 등록이 됩니다.

이후 모임의 공유페이지에서 각 멤버들에게 송금 링크가 생성되고 해당 링크를 통해 편하게 입금이 가능합니다.

## 공유

정산된 모든 정보는 결과 페이지에서 확인할 수 있으며 결과 페이지는 수정이 불가합니다.
페이지의 링크를 멤버들에게 공유하는 방식으로는 아래 두 가지중에서 선택할 수 있습니다.

- 링크 공유하기
- 카카오톡으로 페이지 공유하기

### 송금링크

멤버들은 공유된 페이지에서 자신의 청구된 금액을 확인할 수 있으며, 총무가 설정한( 토스 송금 계좌, 카카오 송금 ID )를 통해 원하는 플랫폼으로 간편하게 송금을 할 수 있습니다.
