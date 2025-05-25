// 각 필드 노출 설정 (true: 표시, false: 숨김)
const fieldSettings = {
    nameField: true,            // 이름 필드
    phoneField: false,           // 연락처 필드
    addressField: true,         // 주소 필드
    addressDetailField: true,   // 상세주소 필드
    optionsField: true,         // 옵션 선택 필드
    serviceTypeField: true,     // 서비스 종류 필드
    contentField: true,         // 문의 내용 필드
    privacyAgreementField: true // 개인정보 동의 필드
};

// 각 필드 필수 여부 설정 (true: 필수, false: 선택)
const requiredSettings = {
    nameField: true,            // 이름 필드
    phoneField: true,           // 연락처 필드
    addressField: true,         // 주소 필드
    addressDetailField: false,  // 상세주소 필드
    optionsField: true,         // 옵션 선택 필드
    serviceTypeField: true,     // 서비스 종류 필드
    contentField: true,         // 문의 내용 필드
    privacyAgreementField: true // 개인정보 동의 필드
};

// 필드 노출 및 필수 여부 적용 함수
function applyFieldSettings() {
    // 각 필드에 대해 노출 여부 및 필수 여부 설정
    for (const fieldId in fieldSettings) {
        const fieldElement = document.getElementById(fieldId);
        
        if (!fieldElement) continue;
        
        if (fieldSettings[fieldId]) {
            // 필드 표시
            fieldElement.classList.remove('hidden');
            
            // 필드 내부의 input/select/textarea 요소 찾기
            const labelElement = fieldElement.querySelector('label');
            const inputElement = fieldElement.querySelector('input, select, textarea');
            
            if (requiredSettings[fieldId] && inputElement) {
                // 필수 필드로 설정
                inputElement.setAttribute('required', 'required');
                if (labelElement) {
                    labelElement.classList.add('required');
                }
            } else if (inputElement) {
                // 선택 필드로 설정
                inputElement.removeAttribute('required');
                if (labelElement) {
                    labelElement.classList.remove('required');
                }
            }
        } else {
            // 필드 숨김
            fieldElement.classList.add('hidden');
            
            // 숨김 필드의 input/select/textarea에서 required 속성 제거
            const inputElement = fieldElement.querySelector('input, select, textarea');
            if (inputElement) {
                inputElement.removeAttribute('required');
            }
        }
    }
}

// 페이지 로드 시 설정 적용
document.addEventListener('DOMContentLoaded', function() {
    applyFieldSettings();
    
    // 주소 검색 관련 요소
    const addressInput = document.getElementById('address');
    const addressDetailInput = document.getElementById('addressDetail');
    const addressContainer = document.getElementById('addressContainer');
    
    // 주소 입력란 클릭 이벤트 (주소 필드가 표시되는 경우에만)
    if (addressInput && fieldSettings.addressField) {
        addressInput.addEventListener('click', function(event) {
            // 이벤트 전파 방지 (클릭 이벤트가 document까지 전파되지 않도록)
            event.stopPropagation();
            
            // 기본주소 입력란 숨기기
            addressInput.style.display = 'none';
            
            // 주소 검색 컨테이너 표시
            addressContainer.style.display = 'block';
            
            // 주소 검색 컴포넌트 삽입
            new daum.Postcode({
                oncomplete: function(data) {
                    // 도로명 주소를 사용하고, 지번 주소가 있는 경우 괄호에 추가
                    if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택한 경우
                        addressInput.value = data.roadAddress;
                    } else { // 사용자가 지번 주소를 선택한 경우
                        addressInput.value = data.jibunAddress;
                    }
                    
                    // 주소 검색 컨테이너 숨김
                    addressContainer.style.display = 'none';
                    
                    // 기본주소 입력란 다시 표시
                    addressInput.style.display = 'block';
                    
                    // 상세주소 필드가 표시되는 경우에만 포커스 이동
                    if (fieldSettings.addressDetailField && addressDetailInput) {
                        addressDetailInput.focus();
                    }
                    
                    // 이벤트 리스너 제거
                    document.removeEventListener('click', handleClickOutside);
                    document.removeEventListener('focusin', handleClickOutside);
                },
                width: '100%',
                height: '100%'
            }).embed(addressContainer);
            
            // 다음 이벤트 사이클에서 이벤트 리스너 등록 (즉시 등록하면 현재 클릭 이벤트에 반응)
            setTimeout(() => {
                document.addEventListener('click', handleClickOutside);
                document.addEventListener('focusin', handleClickOutside);
            }, 0);
        });
        
        // 주소 검색 컨테이너 클릭 시 이벤트 전파 방지
        addressContainer.addEventListener('click', function(event) {
            event.stopPropagation();
        });
    }
    
    // 주소창 외부 클릭 처리 핸들러
    function handleClickOutside(event) {
        // 클릭된 요소가 주소 컨테이너나 주소 입력란이 아닌지 확인
        if (addressContainer.style.display === 'block' && 
            !addressContainer.contains(event.target) && 
            event.target !== addressInput) {
            
            // 주소 검색 컨테이너 숨김
            addressContainer.style.display = 'none';
            
            // 기본주소 입력란 다시 표시
            addressInput.style.display = 'block';
            
            // 이벤트 리스너 제거
            document.removeEventListener('click', handleClickOutside);
            document.removeEventListener('focusin', handleClickOutside);
        }
    }
    
    // 폼 제출 이벤트
    const form = document.getElementById('inquiryForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 폼 제출 시 선택된 옵션 수집
            const selectedOptions = [];
            document.querySelectorAll('input[name="options[]"]:checked').forEach(function(checkbox) {
                selectedOptions.push(checkbox.value);
            });
            
            const formData = new FormData(this);
            const formObject = {};

            formObject.selectedOptions = selectedOptions;
            
            formData.forEach((value, key) => {
                formObject[key] = value;
            });
            
            console.log('제출된 데이터:', formObject);
            
            // 성공 메시지 표시
            alert('문의가 성공적으로 접수되었습니다. 감사합니다.');
            this.reset();
            
            // 주소 관련 필드 초기화
            if (addressInput) addressInput.value = '';
            if (addressDetailInput) addressDetailInput.value = '';
            if (addressContainer) addressContainer.style.display = 'none';
        });
    }

    const privacyPolicyLink = document.getElementById('privacyPolicyLink');
    const privacyPolicySection = document.getElementById('privacyPolicySection');
    
    if (privacyPolicyLink && privacyPolicySection) {
        privacyPolicyLink.addEventListener('click', function(e) {
            e.preventDefault(); // 기본 링크 동작 방지
            
            // 개인정보 처리방침 섹션 토글
            const isVisible = privacyPolicySection.style.display === 'block';
            privacyPolicySection.style.display = isVisible ? 'none' : 'block';
            
            // 표시할 때만 스크롤
            if (!isVisible) {
                // 부드러운 스크롤로 처리방침 섹션으로 이동
                privacyPolicySection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }

    document.querySelectorAll('.service-item').forEach(link => {
        link.addEventListener('click', function(e){
            e.preventDefault();

            const targetId = this.dataset.target;
            const selectedOption = this.dataset.option;

            //이동할 섹션
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                const offset = -70;
                const scrollPos = targetEl.getBoundingClientRect().top + window.pageYOffset + offset;

                window.scrollTo({
                    top: scrollPos,
                    behavior: 'smooth'
                });
            }

            //체크박스 초기화
            document.querySelectorAll('input[name="options[]"]').forEach(cb => {
                cb.checked = false;
            });

            //해당 항목 체크
            const targetCheckbox = Array.from(document.querySelectorAll('input[name="options[]"]'))
                .find(cb => cb.value === selectedOption);
            if(targetCheckbox) {
                targetCheckbox.checked = true;
            }
        });
    });

});