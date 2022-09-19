import { useReactiveVar } from '@apollo/client';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useNavigate } from 'react-router-dom';
import Worning from '../../components/atoms/Warning';
import { useSearchPatientLazyQuery } from '../../graphql/generated/graphql';
import { selectedInfoVar } from '../../store';
import { MUOOL } from '../../constants/constants';
import Loading from '../../components/atoms/Loading';
import useWindowSize from '../../hooks/useWindowSize';
import { cls, renameUseSplit } from '../../utils/utils';
import useStore from '../../hooks/useStore';
import Checkbox from '../../components/molecules/Checkbox';
import { useForm } from 'react-hook-form';
import SearchList from './organisms/SearchList';
import ListCell from './atoms/ListCell';

export default function Search() {
  const location = useLocation();
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [pageNumbers, setPageNumbers] = useState([1]);
  const selectedInfo = useReactiveVar(selectedInfoVar);
  const { clinicLists } = useStore();
  const { register, getValues } = useForm<{ clinicIds: number[] }>();

  const [callQuery, { loading, data }] = useSearchPatientLazyQuery();

  useEffect(() => {
    const { search } = location;
    const [_, queryName] = search.split('?name=');
    if (!queryName) {
      return navigate(-1);
    }
    callQuery({
      variables: {
        input: {
          page,
          query: decodeURI(queryName),
          clinicId: selectedInfo.clinic!.id,
        },
      },
      onCompleted(data) {
        if (data.searchPatient.totalPages) {
          const totalPageCount = Math.ceil(data.searchPatient.totalPages / 20);
          const numbers = [1];
          while (numbers.length < totalPageCount) {
            numbers.push(numbers.length + 1);
          }

          setPageNumbers(numbers);
        }
      },
    });
  }, [location]);

  const { height } = useWindowSize(true);

  if (loading) return <Loading />;
  if (
    !data ||
    !data.searchPatient.patients ||
    data.searchPatient.patients.length === 0
  )
    return <Worning type="emptySearch" />;

  return (
    <>
      <Helmet>
        <title>검색 | {MUOOL}</title>
      </Helmet>
      <div
        className="mx-auto overflow-y-scroll border-t bg-white pb-16"
        style={{ height }}
      >
        <div id="Search-Header" className="shadow-sm">
          <h1 className="border-b px-6 py-2 text-base font-bold">환자 검색</h1>
          <div className="flex gap-6 border-b px-6 py-2">
            {clinicLists.map((clinic) => (
              <Checkbox
                key={clinic.id}
                id={clinic.id + ''}
                label={renameUseSplit(clinic.name)}
                type="checkbox"
                value={clinic.id}
                register={register('clinicIds', {
                  required: true,
                })}
              />
            ))}
          </div>
          <div className="flex divide-x border-b-2 px-6">
            {['병원', '등록번호', '이름', '성별', '생년월일'].map((title) => (
              <ListCell>{title}</ListCell>
            ))}
          </div>
        </div>
        <div id="Search-Results" className="divide-y">
          {data?.searchPatient.patients?.map((patient, idx) => (
            <SearchList
              key={idx}
              clinicName={renameUseSplit(patient.clinic?.name || 'error')}
              registrationNumber={patient.registrationNumber}
              name={patient.name}
              gender={patient.gender}
              birthday={patient.birthday}
            />
          ))}
        </div>
        <div
          id="Search-Footer"
          className="absolute bottom-0 flex h-16 w-full items-center justify-center gap-2 border-t-2 bg-white text-sm"
        >
          {pageNumbers.map((pageNumber) => (
            <button
              key={pageNumber}
              type="button"
              className={cls(
                'px-2',
                page === pageNumber ? 'text-base font-semibold' : ''
              )}
            >
              {pageNumber}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
