package com.example.serviceexam.mapper;


import com.example.serviceexam.entity.Exam;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExamMapper {
    @Select("select * from exam")
    List<Exam> showAllExams();
    @Select("select max(examId) from exam")
    int getMaxExamId();
    @Insert("insert into exam(examId, examName,startTime ,endTime ,paperId,className )VALUES(#{examId}, #{examName},#{startTime} ,#{endTime} ,#{paperId} ,#{className}  ) ")
    void createExam(@Param("examId")int examId,@Param("examName")String examName,@Param("startTime")String startTime,
                    @Param("endTime")String endTime,@Param("paperId")int paperId,@Param("className")String className);
}
