package com.mvcvs.repository;

import com.mvcvs.entity.QuizSubmission;
import com.mvcvs.entity.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QuizSubmissionRepository extends JpaRepository<QuizSubmission, Long> {
    List<QuizSubmission> findBySession(Session session);
    List<QuizSubmission> findBySessionId(Long sessionId);
}

