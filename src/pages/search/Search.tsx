import { useLazyQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { createArrayFromLength, renameUseSplit } from '../../utils/commonUtils';
import { useWindowSize } from '../../hooks';
import { getYMD } from '../../utils/dateUtils';
import { ButtonOfPages, Warning } from '../../components';
import {
  SearchCheckList,
  SearchList,
  SearchPatientForm,
  SearchTitle,
} from './components';
import { GENDER_KOR, MUOOL } from '../../constants/constants';
import { SEARCH_PATIENT_DOCUMENT } from '../../graphql';
import { useStore } from '../../store';
import type { SearchPatientQuery } from '../../types/generatedTypes';

export default function Search() {
  const clinicId = useStore((state) => state.pickedClinicId);
  const location = useLocation();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const [callQuery, { data }] = useLazyQuery<SearchPatientQuery>(
    SEARCH_PATIENT_DOCUMENT
  );

  const { register, getValues } = useForm<{ clinicIds: number[] }>({
    defaultValues: { clinicIds: [clinicId] },
  });

  const { height } = useWindowSize(true);

  const [getParams] = useSearchParams();

  const invokeQuery = () => {
    const name = getParams.get('name');
    if (!name) return navigate(-1);

    const { clinicIds } = getValues();
    callQuery({
      variables: {
        input: {
          page,
          query: name,
          clinicIds: clinicIds.map((id) => +id),
        },
      },
    });
  };

  const numberOfPages = createArrayFromLength(
    data?.searchPatient.totalPages || 1
  );

  const changePage = (pageNumber: number) => {
    if (page === pageNumber) return;
    setPage(pageNumber);
  };

  useEffect(() => {
    invokeQuery();
  }, [location, page]);

  return (
    <>
      <Helmet>
        <title>검색 | {MUOOL}</title>
      </Helmet>
      <div
        className="mx-auto w-full overflow-y-scroll border-t bg-white pb-16"
        style={{ height }}
      >
        <div id="search__header" className="shadow-sm">
          <div className="flex justify-between border-b px-6 py-2">
            <h1 className="text-base font-bold">환자 검색</h1>
            <SearchPatientForm />
          </div>
          <SearchCheckList register={register} />
          <SearchTitle
            subject={['병원', '등록번호', '이름', '성별', '생년월일', '기능']}
          />
        </div>
        <div id="search__results" className="divide-y">
          {!data?.searchPatient.patients ||
          data.searchPatient.patients.length === 0 ? (
            <Warning>{`"${getParams.get(
              'name'
            )}"의 검색결과가 없습니다`}</Warning>
          ) : (
            data.searchPatient.patients.map((patient, idx) => (
              <SearchList
                key={idx}
                id={patient.id}
                clinicName={renameUseSplit(patient.clinic?.name || 'error')}
                registrationNumber={patient.registrationNumber}
                name={patient.name}
                gender={GENDER_KOR[patient.gender as keyof typeof GENDER_KOR]}
                birthday={getYMD(patient.birthday, 'yyyymmdd', '-')}
              />
            ))
          )}
        </div>
        <div
          id="search__footer"
          className="absolute bottom-0 flex h-16 w-full items-center justify-center gap-2 border-t-2 bg-white text-sm"
        >
          {numberOfPages.map((pageNumber) => (
            <ButtonOfPages
              key={pageNumber}
              page={pageNumber}
              isActive={pageNumber === page}
              changePage={changePage}
              hasBorder
            />
          ))}
        </div>
      </div>
    </>
  );
}
