import { Link } from 'react-router-dom';
import { Trash2, Check, X, ArrowLeft, GraduationCap, Building2 } from 'lucide-react';
import { useCompareStore } from '../store/useCompareStore';
import { useLocale } from '@/components/LocaleProvider';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';

const ComparePage = () => {
  const { compareList, compareProgramsList, removeFromCompare, removeProgramFromCompare } = useCompareStore();
  const { t } = useLocale();

  // Если нет ни университетов, ни программ
  if (compareList.length === 0 && compareProgramsList.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold tracking-tight mb-8">{t('compare.title')}</h1>
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground mb-6">{t('compare.empty')}</p>
            <Button asChild>
              <Link to="/">{t('compare.goToCatalog')}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Tabs defaultValue="universities" className="w-full">
        <TabsList>
          <TabsTrigger value="universities" className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            {t('compare.tabs.universities')} {compareList.length > 0 && `(${compareList.length})`}
          </TabsTrigger>
          <TabsTrigger value="programs" className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            {t('compare.tabs.programs')} {compareProgramsList.length > 0 && `(${compareProgramsList.length})`}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="universities" className="mt-6">
          {compareList.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground mb-6">{t('compare.emptyUniversities')}</p>
                <Button asChild>
                  <Link to="/">{t('compare.goToCatalog')}</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <div className="overflow-x-auto">
                <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px] pl-6 pr-8">{t('compare.parameter')}</TableHead>
                {/* Пустая колонка-спейсер для центрирования */}
                <TableHead className="w-auto"></TableHead>
                {compareList.map((university) => (
                  <TableHead key={university.id} className="min-w-[200px] pl-6">
                    <div className="flex items-center justify-between">
                      <Link
                        to={`/university/${university.id}`}
                        className="text-foreground hover:text-foreground/80 transition-colors"
                      >
                        {university.name}
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromCompare(university.id)}
                        className="ml-4 h-8 w-8"
                        aria-label="Удалить из сравнения"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableHead>
                ))}
                {/* Пустая колонка-спейсер для центрирования */}
                <TableHead className="w-auto"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium pl-6 pr-8">{t('compare.city')}</TableCell>
                <TableCell></TableCell>
                {compareList.map((university) => (
                  <TableCell key={university.id} className="pl-6">{university.city}</TableCell>
                ))}
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium pl-6 pr-8">{t('compare.cost')}</TableCell>
                <TableCell></TableCell>
                {compareList.map((university) => (
                  <TableCell key={university.id} className="pl-6">
                    {university.price.toLocaleString()} ₸
                  </TableCell>
                ))}
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium pl-6 pr-8">{t('compare.rating')}</TableCell>
                <TableCell></TableCell>
                {compareList.map((university) => (
                  <TableCell key={university.id} className="pl-6">{university.rating}/5</TableCell>
                ))}
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium pl-6 pr-8">{t('compare.minScore')}</TableCell>
                <TableCell></TableCell>
                {compareList.map((university) => (
                  <TableCell key={university.id} className="pl-6">{university.minEntScore}</TableCell>
                ))}
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium pl-6 pr-8">{t('compare.dormitory')}</TableCell>
                <TableCell></TableCell>
                {compareList.map((university) => (
                  <TableCell key={university.id} className="pl-6">
                    {university.hasDormitory ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <X className="w-5 h-5 text-red-600" />
                    )}
                  </TableCell>
                ))}
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium pl-6 pr-8">{t('compare.type')}</TableCell>
                <TableCell></TableCell>
                {compareList.map((university) => (
                  <TableCell key={university.id} className="pl-6">
                    {university.isPrivate ? t('compare.private') : t('compare.public')}
                  </TableCell>
                ))}
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium pl-6 pr-8">{t('compare.languages')}</TableCell>
                <TableCell></TableCell>
                {compareList.map((university) => (
                  <TableCell key={university.id} className="pl-6">
                    {university.languages && university.languages.length > 0
                      ? university.languages.join(', ')
                      : '-'}
                  </TableCell>
                ))}
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium pl-6 pr-8">{t('compare.grantsPerYear')}</TableCell>
                <TableCell></TableCell>
                {compareList.map((university) => (
                  <TableCell key={university.id} className="pl-6">
                    {university.grantsPerYear ? university.grantsPerYear.toLocaleString() : '-'}
                  </TableCell>
                ))}
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium pl-6 pr-8">{t('compare.exchangeProgram')}</TableCell>
                <TableCell></TableCell>
                {compareList.map((university) => (
                  <TableCell key={university.id} className="pl-6">
                    {university.international?.exchangePrograms && university.international.exchangePrograms.length > 0 ? (
                      <div className="max-h-32 overflow-y-auto">
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          {university.international.exchangePrograms.map((program, idx) => (
                            <li key={idx} className="text-muted-foreground">{program}</li>
                          ))}
                        </ul>
                      </div>
                    ) : university.international?.hasExchangeProgram ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <X className="w-5 h-5 text-red-600" />
                    )}
                  </TableCell>
                ))}
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium pl-6 pr-8">{t('compare.doubleDegree')}</TableCell>
                <TableCell></TableCell>
                {compareList.map((university) => (
                  <TableCell key={university.id} className="pl-6">
                    {university.international?.doubleDegreePrograms && university.international.doubleDegreePrograms.length > 0 ? (
                      <div className="max-h-32 overflow-y-auto">
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          {university.international.doubleDegreePrograms.map((program, idx) => (
                            <li key={idx} className="text-muted-foreground">{program}</li>
                          ))}
                        </ul>
                      </div>
                    ) : university.international?.hasDoubleDegree ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <X className="w-5 h-5 text-red-600" />
                    )}
                  </TableCell>
                ))}
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium pl-6 pr-8">{t('compare.requiresIELTS')}</TableCell>
                <TableCell></TableCell>
                {compareList.map((university) => (
                  <TableCell key={university.id} className="pl-6">
                    {university.international?.minIELTS !== undefined && university.international.minIELTS !== null ? (
                      <span className="text-sm font-medium">{university.international.minIELTS}</span>
                    ) : university.international?.requiresIELTS ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <X className="w-5 h-5 text-red-600" />
                    )}
                  </TableCell>
                ))}
                <TableCell></TableCell>
              </TableRow>
                </TableBody>
              </Table>
            </div>
          </Card>
          )}
        </TabsContent>

        <TabsContent value="programs" className="mt-6">
          {compareProgramsList.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground mb-6">{t('compare.emptyPrograms')}</p>
                <p className="text-sm text-muted-foreground">{t('compare.emptyProgramsHint')}</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px] pl-6 pr-8">{t('compare.parameter')}</TableHead>
                      <TableHead className="w-auto"></TableHead>
                      {compareProgramsList.map((item, index) => (
                        <TableHead key={`${item.universityId}-${item.program.name}-${index}`} className="min-w-[200px] pl-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <Link
                                to={`/university/${item.universityId}`}
                                className="text-foreground hover:text-foreground/80 transition-colors text-sm"
                              >
                                {item.universityName}
                              </Link>
                              <div className="font-semibold mt-1">{item.program.name}</div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeProgramFromCompare(item.universityId, item.program.name)}
                              className="ml-4 h-8 w-8"
                              aria-label={t('compare.removeProgram')}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableHead>
                      ))}
                      <TableHead className="w-auto"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium pl-6 pr-8">{t('compare.programs.degree')}</TableCell>
                      <TableCell></TableCell>
                      {compareProgramsList.map((item, index) => (
                        <TableCell key={`degree-${index}`} className="pl-6">
                          {item.program.degree === 'Bachelor' && t('details.programs.bachelor')}
                          {item.program.degree === 'Master' && t('details.programs.master')}
                          {item.program.degree === 'PhD' && t('details.programs.phd')}
                        </TableCell>
                      ))}
                      <TableCell></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium pl-6 pr-8">{t('compare.programs.duration')}</TableCell>
                      <TableCell></TableCell>
                      {compareProgramsList.map((item, index) => (
                        <TableCell key={`duration-${index}`} className="pl-6">
                          {item.program.duration ? `${item.program.duration} ${t('compare.programs.years')}` : '-'}
                        </TableCell>
                      ))}
                      <TableCell></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium pl-6 pr-8">{t('compare.programs.language')}</TableCell>
                      <TableCell></TableCell>
                      {compareProgramsList.map((item, index) => (
                        <TableCell key={`language-${index}`} className="pl-6">
                          {item.program.language || '-'}
                        </TableCell>
                      ))}
                      <TableCell></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium pl-6 pr-8">{t('compare.programs.tuitionFee')}</TableCell>
                      <TableCell></TableCell>
                      {compareProgramsList.map((item, index) => (
                        <TableCell key={`tuition-${index}`} className="pl-6">
                          {item.program.tuitionFee ? `${item.program.tuitionFee.toLocaleString()} ₸` : '-'}
                        </TableCell>
                      ))}
                      <TableCell></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium pl-6 pr-8">{t('compare.programs.minEntScore')}</TableCell>
                      <TableCell></TableCell>
                      {compareProgramsList.map((item, index) => (
                        <TableCell key={`score-${index}`} className="pl-6">
                          {item.program.minEntScore ?? '-'}
                        </TableCell>
                      ))}
                      <TableCell></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium pl-6 pr-8">{t('compare.programs.internship')}</TableCell>
                      <TableCell></TableCell>
                      {compareProgramsList.map((item, index) => (
                        <TableCell key={`internship-${index}`} className="pl-6">
                          {item.program.hasInternship ? (
                            <Check className="w-5 h-5 text-green-600" />
                          ) : (
                            <X className="w-5 h-5 text-red-600" />
                          )}
                        </TableCell>
                      ))}
                      <TableCell></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium pl-6 pr-8">{t('compare.programs.doubleDegree')}</TableCell>
                      <TableCell></TableCell>
                      {compareProgramsList.map((item, index) => (
                        <TableCell key={`double-${index}`} className="pl-6">
                          {item.program.hasDoubleDegree ? (
                            <Check className="w-5 h-5 text-green-600" />
                          ) : (
                            <X className="w-5 h-5 text-red-600" />
                          )}
                        </TableCell>
                      ))}
                      <TableCell></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium pl-6 pr-8">{t('compare.programs.employmentRate')}</TableCell>
                      <TableCell></TableCell>
                      {compareProgramsList.map((item, index) => (
                        <TableCell key={`employment-${index}`} className="pl-6">
                          {item.program.employmentRate !== null && item.program.employmentRate !== undefined
                            ? `${item.program.employmentRate}%`
                            : '-'}
                        </TableCell>
                      ))}
                      <TableCell></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium pl-6 pr-8">{t('compare.programs.description')}</TableCell>
                      <TableCell></TableCell>
                      {compareProgramsList.map((item, index) => (
                        <TableCell key={`desc-${index}`} className="pl-6">
                          {item.program.description || '-'}
                        </TableCell>
                      ))}
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <Link
        to="/"
        className="inline-flex items-center mt-6 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        {t('compare.backToCatalog')}
      </Link>
    </div>
  );
};

export default ComparePage;

